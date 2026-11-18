// Gray Matter internal dialer. All contact data comes from the authenticated API.
const $ = id => document.getElementById(id);
const config = window.GM_DIALER_CONFIG || {};
const apiBase = String(config.apiBase || "").replace(/\/$/, "");
const state = {
  key: "", contacts: [], selectedId: null, device: null, call: null,
  attempted: new Set(), busy: false, autoNext: false, tokenExpiresAt: 0, pendingOutcomeId: null
};
const QUEUE_STAGES = new Set(["new", "no_answer", "voicemail", "callback"]);
const LABELS = {
  new: "New", connected: "Connected", no_answer: "No answer",
  voicemail: "Voicemail", callback: "Call back", not_interested: "Not interested",
  do_not_call: "Do not call"
};
const TZ = new Set(["America/New_York","America/Chicago","America/Denver","America/Phoenix","America/Los_Angeles","America/Anchorage","Pacific/Honolulu"]);
function current() { return state.contacts.find(c => c.id === state.selectedId); }
function feedback(message) {
  $("feedback").textContent = message;
  $("feedback").hidden = false;
  clearTimeout(feedback.timer);
  feedback.timer = setTimeout(() => { $("feedback").hidden = true; }, 5000);
}
function setCallState(message) {
  $("call-state").textContent = message;
  $("connection-status").textContent = message;
}
async function request(path, options = {}) {
  if (!apiBase) throw Error("API not configured. See dialer/README.md.");
  const response = await fetch(apiBase + path, {
    ...options,
    headers: {
      Authorization: "Bearer " + state.key,
      ...(options.body ? {"Content-Type": "application/json"} : {}),
      ...(options.headers || {})
    },
    cache: "no-store",
    credentials: "omit"
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) lock();
    throw Error(body.error || "Request failed (" + response.status + ")");
  }
  return body;
}
function localHour(c) {
  try {
    if (!TZ.has(c.timezone)) return null;
    return Number(new Intl.DateTimeFormat("en-US", {hour: "2-digit", hourCycle: "h23", timeZone: c.timezone}).format(new Date()));
  } catch (_) { return null; }
}
function withinHours(c) {
  const hour = localHour(c);
  return hour !== null && hour >= 8 && hour < 21;
}
function eligible(c) {
  return Boolean(c.call_allowed) && c.status !== "do_not_call" && TZ.has(c.timezone);
}
function localDate(zone) {
  if (!TZ.has(zone)) return "";
  const parts = new Intl.DateTimeFormat("en-US",{
    timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type)?.value || "";
  return get("year") + "-" + get("month") + "-" + get("day");
}
function queueMember(c) {
  const today = localDate(c.timezone);
  return eligible(c) && withinHours(c) && QUEUE_STAGES.has(c.status) &&
    (!c.follow_up_at || c.follow_up_at <= today);
}
function initials(c) {
  return String(c.name || "?").trim().split(/\s+/).slice(0,2).map(x=>x[0] || "").join("").toUpperCase();
}
function node(tag, cls, value) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (value != null) el.textContent = String(value);
  return el;
}
function statusLabel(c) {
  if (c.status === "do_not_call") return "Do not call";
  if (!c.call_allowed) return "Review needed";
  if (!TZ.has(c.timezone)) return "Set time zone";
  if (!withinHours(c)) return "Outside hours";
  return LABELS[c.status] || "New";
}
function renderList() {
  const list = $("contact-list");
  list.replaceChildren();
  const term = $("contact-search").value.trim().toLowerCase();
  const filter = $("contact-filter").value;
  const items = state.contacts.filter(c => {
    const searchable = [c.name,c.company,c.phone].join(" ").toLowerCase();
    if (!searchable.includes(term)) return false;
    if (filter === "queue") return queueMember(c) && !state.attempted.has(c.id);
    if (filter === "pending") return !c.call_allowed && c.status !== "do_not_call";
    if (filter === "dnc") return c.status === "do_not_call";
    return true;
  });
  if (!items.length) list.append(node("div", "list-empty", "No contacts match this view."));
  items.forEach(c => {
    const item = node("button", "contact-item");
    item.type = "button";
    item.setAttribute("role","listitem");
    item.setAttribute("aria-current", String(c.id === state.selectedId));
    const avatar = node("span","mini-avatar",initials(c));
    const detail = node("span","contact-copy");
    detail.append(node("strong","",c.name),node("span","",[c.company || "No business name",c.phone].join(" · ")));
    const tag = node("span","tag" + (c.status === "do_not_call" ? " stop" : !c.call_allowed ? " warn" : ""),statusLabel(c));
    item.append(avatar,detail,tag);
    item.addEventListener("click", () => selectContact(c.id));
    list.append(item);
  });
}
function renderDetails() {
  const c = current();
  $("no-contact").hidden = !!c;
  $("contact-details").hidden = !c;
  if (!c) return;
  $("selected-initials").textContent = initials(c);
  $("selected-name").textContent = c.name;
  $("selected-company").textContent = c.company || "Business not specified";
  $("selected-phone").textContent = c.phone;
  $("selected-stage").textContent = statusLabel(c);
  $("selected-source").textContent = c.source || "Not provided";
  $("selected-followup").textContent = c.follow_up_at || "Not scheduled";
  try {
    $("selected-local-time").textContent = c.timezone
      ? new Intl.DateTimeFormat("en-US",{timeZone:c.timezone,hour:"numeric",minute:"2-digit",timeZoneName:"short"}).format(new Date())
      : "Unspecified";
  } catch (_) { $("selected-local-time").textContent = "Unspecified"; }
  $("eligibility-panel").hidden = Boolean(c.call_allowed) || c.status === "do_not_call";
  $("review-timezone").value = TZ.has(c.timezone) ? c.timezone : "";
  $("eligibility-note").value = c.eligibility_note || "";
  $("review-confirm").checked = false;
  $("dial-button").disabled = Boolean(state.call || state.busy) || !queueMember(c);
  $("dial-button").textContent = c.status === "do_not_call" ? "Blocked: do not call" : !c.call_allowed ? "Review before calling" : !withinHours(c) ? "Outside calling hours" : "Call contact";
  $("hangup-button").disabled = !state.call;
  $("next-button").disabled = !!state.call || state.busy || !!state.pendingOutcomeId;
}
function render() {
  const contacts = state.contacts;
  $("stat-total").textContent = contacts.length;
  $("stat-cleared").textContent = contacts.filter(eligible).length;
  const queued = contacts.filter(c => queueMember(c) && !state.attempted.has(c.id)).length;
  $("stat-queue").textContent = queued;
  $("queue-count").textContent = queued + " in queue";
  $("stat-followups").textContent = contacts.filter(c => c.status === "callback").length;
  renderList();
  renderDetails();
}
function selectContact(id) {
  if (state.call || state.busy || state.pendingOutcomeId) { feedback("Log the previous call outcome before changing contacts."); return; }
  state.selectedId = id;
  $("outcome-form").reset();
  render();
}
async function refresh() {
  const data = await request("/api/contacts");
  state.contacts = Array.isArray(data.contacts) ? data.contacts : [];
  if (!state.contacts.some(c => c.id === state.selectedId)) state.selectedId = state.contacts[0]?.id || null;
  render();
}
function lock() {
  if (state.call) { try { state.call.disconnect(); } catch (_) {} }
  state.device?.destroy();
  state.device = null;
  state.call = null;
  state.key = "";
  state.contacts = [];
  state.selectedId = null;
  state.attempted.clear();
  state.autoNext = false;
  state.tokenExpiresAt = 0;
  state.pendingOutcomeId = null;
  $("auto-next").checked = false;
  $("api-key").value = "";
  $("workspace").hidden = true;
  $("login-panel").hidden = false;
  $("lock-button").hidden = true;
  setCallState("Not connected");
}
async function unlock(event) {
  event.preventDefault();
  if (!apiBase) { $("setup-notice").hidden = false; return; }
  state.key = $("api-key").value.trim();
  try {
    await refresh();
    $("login-panel").hidden = true;
    $("workspace").hidden = false;
    $("lock-button").hidden = false;
    $("api-key").value = "";
    setCallState("Ready");
  } catch (error) { feedback(error.message); if (!$("workspace").hidden) lock(); }
}
function parseCsv(csv) {
  // RFC 4180-style quoted cells, embedded commas, and newlines.
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (quoted) {
      if (char === '"' && csv[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && !field) quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (quoted) throw Error("CSV has an unclosed quote.");
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const [header,...data] = rows;
  if (!header) throw Error("CSV is empty.");
  const columns = header.map(h => h.trim().replace(/^\uFEFF/, "").toLowerCase());
  if (!["name","phone"].every(key => columns.includes(key))) throw Error("CSV must include name and phone headers.");
  const items = data.filter(c => c.some(v => v.trim())).map(r => Object.fromEntries(["name","company","phone","source","timezone"].map(k => [k,(r[columns.indexOf(k)] || "").trim()])));
  if (items.length > 200) throw Error("Import up to 200 contacts at a time.");
  return items;
}
async function importContacts(items) {
  if (!items.length) throw Error("No contacts found.");
  const result = await request("/api/import", {method:"POST",body:JSON.stringify({contacts:items})});
  await refresh();
  feedback(result.imported + " added; " + result.skipped + " duplicates skipped. Review each contact before calling.");
}
async function ensureDevice() {
  if (state.device) {
    if (Date.now() > state.tokenExpiresAt - 300000) {
      const {token} = await request("/api/token",{method:"POST"});
      await state.device.updateToken(token);
      state.tokenExpiresAt = Date.now() + 3600000;
    }
    return state.device;
  }
  // Twilio no longer provides an official SDK CDN. ESM.sh serves the pinned npm build.
  // For production, vendor a reviewed SDK build and replace this URL.
  const {Device} = await import("https://esm.sh/@twilio/voice-sdk@2.18.5?bundle");
  const {token} = await request("/api/token",{method:"POST"});
  const device = new Device(token,{logLevel:"error"});
  device.on("error", err => feedback("Phone service: " + (err.message || "connection error")));
  state.device = device;
  state.tokenExpiresAt = Date.now() + 3600000;
  return device;
}
async function callContact() {
  const c = current();
  if (!c || !queueMember(c) || state.call || state.busy) return;
  state.busy = true; renderDetails(); setCallState("Preparing call");
  try {
    const device = await ensureDevice();
    const {dialToken} = await request("/api/authorize",{method:"POST",body:JSON.stringify({contact_id:c.id})});
    const call = await device.connect({params:{DialToken:dialToken}});
    state.call = call;
    state.pendingOutcomeId = c.id;
    state.attempted.add(c.id);
    setCallState("Calling");
    call.on("accept", () => setCallState("Connected"));
    call.on("disconnect", () => {
      if (state.call === call) state.call = null;
      setCallState("Call ended · log outcome");
      render();
    });
    call.on("cancel", () => {
      if (state.call === call) state.call = null;
      setCallState("Call canceled · log outcome");
      render();
    });
    call.on("error", error => {
      if (state.call === call) state.call = null;
      setCallState("Call error");
      feedback(error.message || "Call failed");
      render();
    });
  } catch (error) {
    setCallState("Ready");
    feedback(error.message || "Could not start call.");
  } finally { state.busy = false; render(); }
}
function nextContact() {
  if (state.call || state.busy || state.pendingOutcomeId) return false;
  const next = state.contacts.find(c => queueMember(c) && !state.attempted.has(c.id) && c.id !== state.selectedId);
  if (!next) { feedback("No more eligible contacts in this session."); return false; }
  selectContact(next.id);
  return true;
}
async function saveOutcome(event) {
  event.preventDefault();
  const c = current();
  if (!c || state.call || state.busy) { feedback("End the active call first."); return; }
  const result = $("outcome").value;
  if (!LABELS[result] || result === "new") { feedback("Choose a call result."); return; }
  if (result === "callback" && !$("followup-date").value) { feedback("Choose a follow-up date for a callback."); return; }
  state.busy = true; $("save-outcome").disabled = true;
  try {
    await request("/api/dispositions",{method:"POST",body:JSON.stringify({
      contact_id:c.id, outcome:result, notes:$("call-notes").value.trim(),
      follow_up_at:$("followup-date").value || null
    })});
    state.attempted.add(c.id);
    state.pendingOutcomeId = null;
    await refresh();
    $("outcome-form").reset();
    setCallState("Outcome saved");
    state.busy = false;
    if (state.autoNext && nextContact()) await callContact();
    else feedback("Outcome saved.");
  } catch (error) { feedback(error.message); }
  finally { state.busy = false; $("save-outcome").disabled = false; render(); }
}
async function approve() {
  const c = current();
  if (!c || state.call || state.busy || c.status === "do_not_call") return;
  const timezone = $("review-timezone").value;
  const note = $("eligibility-note").value.trim();
  if (!TZ.has(timezone) || note.length < 15 || !$("review-confirm").checked) {
    feedback("Choose the actual time zone, add at least 15 characters of verification notes, and confirm eligibility.");
    return;
  }
  try {
    await request("/api/contacts/" + encodeURIComponent(c.id),{
      method:"PATCH",body:JSON.stringify({call_allowed:true,timezone,eligibility_note:note})
    });
    await refresh();
    feedback("Contact cleared. Calling-hours restrictions still apply.");
  } catch (error) { feedback(error.message); }
}
$("login-form").addEventListener("submit",unlock);
$("lock-button").addEventListener("click",lock);
$("refresh-button").addEventListener("click",async()=>{try{await refresh();feedback("Contacts updated.");}catch(e){feedback(e.message);}});
$("contact-search").addEventListener("input",renderList);
$("contact-filter").addEventListener("change",renderList);
$("contact-form").addEventListener("submit",async event=>{
  event.preventDefault();
  const form = event.currentTarget;
  const item = Object.fromEntries(new FormData(form));
  try { await importContacts([item]); form.reset(); } catch(e){ feedback(e.message); }
});
$("import-button").addEventListener("click",async()=>{
  const file = $("csv-file").files[0];
  if (!file) { feedback("Choose a CSV file."); return; }
  if (file.size > 200000) { feedback("CSV too large (200 KB max)."); return; }
  try { await importContacts(parseCsv(await file.text())); $("csv-file").value = ""; } catch(e) { feedback(e.message); }
});
$("approve-button").addEventListener("click",approve);
$("dial-button").addEventListener("click",callContact);
$("hangup-button").addEventListener("click",()=>{if(state.call) state.call.disconnect();});
$("next-button").addEventListener("click",nextContact);
$("outcome-form").addEventListener("submit",saveOutcome);
$("auto-next").addEventListener("change",event=>{state.autoNext=event.target.checked;});
$("setup-notice").hidden = !!apiBase;
