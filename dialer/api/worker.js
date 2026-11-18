/**
 * Gray Matter Power Dialer API — Cloudflare Worker + D1 + Twilio Voice.
 * This worker is deployed separately from the public GitHub Pages website.
 * No credentials, lead records, or operator keys are embedded in site assets.
 */
const ZONES = new Set([
  "America/New_York","America/Chicago","America/Denver","America/Phoenix",
  "America/Los_Angeles","America/Anchorage","Pacific/Honolulu"
]);
const OUTCOMES = new Set(["connected","no_answer","voicemail","callback","not_interested","do_not_call"]);
const MAX_BODY_BYTES = 240000;
const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status, headers: {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}
  });
}
function err(message, status = 400) { return json({error:message},status); }
function xml(data, status = 200) {
  return new Response(data, {status,headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"no-store"}});
}
function cors(response, origin) {
  if (!origin) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin",origin);
  headers.set("Access-Control-Allow-Headers","Authorization,Content-Type");
  headers.set("Access-Control-Allow-Methods","GET,POST,PATCH,OPTIONS");
  headers.set("Vary","Origin");
  return new Response(response.body,{status:response.status,headers});
}
async function secureEqual(a,b) {
  // Comparing fixed-length digests avoids timing leaks from short-circuit string comparisons.
  const [aa,bb] = await Promise.all([
    crypto.subtle.digest("SHA-256",encoder.encode(String(a||""))),
    crypto.subtle.digest("SHA-256",encoder.encode(String(b||"")))
  ]);
  const x = new Uint8Array(aa), y = new Uint8Array(bb);
  let diff = 0;
  for (let i=0;i<x.length;i++) diff |= x[i]^y[i];
  return diff===0;
}
function usPhone(value) {
  const digits = String(value || "").replace(/[^0-9]/g,"");
  const normalized = digits.length===11 && digits[0]==="1" ? digits.slice(1) : digits;
  // US NANP, including valid area code/exchange leading digits.
  return /^[2-9][0-9]{2}[2-9][0-9]{6}$/.test(normalized) ? "+1"+normalized : null;
}
function safeText(value,max) { return String(value || "").trim().slice(0,max); }
function goodZone(zone) { return ZONES.has(zone); }
function allowedNow(zone) {
  if (!goodZone(zone)) return false;
  const hour = Number(new Intl.DateTimeFormat("en-US",{
    hour:"2-digit",hourCycle:"h23",timeZone:zone
  }).format(new Date()));
  return hour>=8 && hour<21;
}
function encodeBase64(bytes) {
  let result = "";
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i=0;i<array.length;i++) result+=String.fromCharCode(array[i]);
  return btoa(result);
}
function base64Url(value) {
  const bytes = typeof value==="string" ? encoder.encode(value) : value;
  return encodeBase64(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function signJwt(env) {
  const now = Math.floor(Date.now()/1000);
  const header = {typ:"JWT",alg:"HS256"};
  const payload = {
    jti:env.TWILIO_API_KEY_SID+"-"+crypto.randomUUID(),
    iss:env.TWILIO_API_KEY_SID,
    sub:env.TWILIO_ACCOUNT_SID,
    iat:now,nbf:now,exp:now+3600,
    grants:{identity:"graymatter-operator",voice:{outgoing:{application_sid:env.TWILIO_TWIML_APP_SID}}}
  };
  const data = base64Url(JSON.stringify(header))+"."+base64Url(JSON.stringify(payload));
  const key = await crypto.subtle.importKey("raw",encoder.encode(env.TWILIO_API_KEY_SECRET),
    {name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig = await crypto.subtle.sign("HMAC",key,encoder.encode(data));
  return data+"."+base64Url(new Uint8Array(sig));
}
async function validateTwilio(request,env,params) {
  const signature = request.headers.get("X-Twilio-Signature");
  if (!signature || !env.TWILIO_AUTH_TOKEN || !env.VOICE_WEBHOOK_URL) return false;
  const sorted = [...params.entries()].sort(([a],[b])=>a.localeCompare(b));
  const signedPayload = env.VOICE_WEBHOOK_URL + sorted.map(([k,v])=>k+v).join("");
  const key = await crypto.subtle.importKey("raw",encoder.encode(env.TWILIO_AUTH_TOKEN),
    {name:"HMAC",hash:"SHA-1"},false,["sign"]);
  const signed = await crypto.subtle.sign("HMAC",key,encoder.encode(signedPayload));
  return secureEqual(signature.trim(),encodeBase64(new Uint8Array(signed)));
}
async function bodyJson(req) {
  const text = await req.text();
  if (encoder.encode(text).length>MAX_BODY_BYTES) throw Error("Request too large.");
  try { return JSON.parse(text); } catch (_) { throw Error("Invalid JSON."); }
}
async function contacts(env) {
  const result = await env.DB.prepare(
    "SELECT id,name,company,phone,source,timezone,status,call_allowed,eligibility_note,follow_up_at,last_contacted_at,created_at FROM contacts ORDER BY created_at DESC LIMIT 500"
  ).all();
  return json({contacts:result.results || []});
}
async function importContacts(req,env) {
  const body = await bodyJson(req);
  if (!Array.isArray(body.contacts) || body.contacts.length<1 || body.contacts.length>200)
    return err("Provide 1–200 contacts.");
  const records = [];
  for (const input of body.contacts) {
    const name = safeText(input.name,100);
    const phone = usPhone(input.phone);
    if (!name || !phone) return err("Each contact needs a name and a valid US phone number.");
    const timezone = goodZone(input.timezone) ? input.timezone : null;
    records.push({
      id:crypto.randomUUID(),name,phone,
      company:safeText(input.company,120),source:safeText(input.source,200),timezone
    });
  }
  const inserts = records.map(c=>env.DB.prepare(
    "INSERT OR IGNORE INTO contacts (id,name,company,phone,source,timezone) VALUES (?,?,?,?,?,?)"
  ).bind(c.id,c.name,c.company,c.phone,c.source,c.timezone));
  const results = await env.DB.batch(inserts);
  const imported = results.reduce((n,r)=>n+(r.meta?.changes || 0),0);
  return json({imported,skipped:records.length-imported},201);
}
async function patchContact(req,env,id) {
  const c = await env.DB.prepare("SELECT * FROM contacts WHERE id=?").bind(id).first();
  if (!c) return err("Contact not found.",404);
  if (c.status==="do_not_call") return err("Do Not Call cannot be reversed through this interface.",403);
  const body = await bodyJson(req);
  // No blanket approval via CSV; one documented review per individual contact.
  if (body.call_allowed!==true) return err("Only individual approval is supported.");
  const note = safeText(body.eligibility_note,500);
  if (!goodZone(body.timezone) || note.length<15) return err("A verified time zone and documented eligibility notes are required.");
  await env.DB.prepare(
    "UPDATE contacts SET call_allowed=1,timezone=?,eligibility_note=?,reviewed_at=datetime('now') WHERE id=?"
  ).bind(body.timezone,note,id).run();
  return json({ok:true});
}
async function disposition(req,env) {
  const body = await bodyJson(req);
  if (!OUTCOMES.has(body.outcome)) return err("Invalid outcome.");
  const id = String(body.contact_id || "");
  const c = await env.DB.prepare("SELECT id,status FROM contacts WHERE id=?").bind(id).first();
  if (!c) return err("Contact not found.",404);
  if (c.status==="do_not_call" && body.outcome!=="do_not_call") return err("Do Not Call cannot be reversed.",403);
  const followup = body.follow_up_at || null;
  if (body.outcome==="callback" && !followup) return err("Callback date is required.");
  if (followup && !/^\d{4}-\d{2}-\d{2}$/.test(followup)) return err("Use YYYY-MM-DD for the follow-up date.");
  const notes = safeText(body.notes,2000);
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO call_outcomes (id,contact_id,outcome,notes,follow_up_at) VALUES (?,?,?,?,?)"
    ).bind(crypto.randomUUID(),id,body.outcome,notes,followup),
    env.DB.prepare(
      "UPDATE contacts SET status=?,follow_up_at=?,last_contacted_at=datetime('now'),call_allowed=CASE WHEN ?='do_not_call' THEN 0 ELSE call_allowed END WHERE id=?"
    ).bind(body.outcome,followup,body.outcome,id)
  ]);
  return json({ok:true});
}
async function authorize(req,env) {
  const body = await bodyJson(req);
  const c = await env.DB.prepare("SELECT * FROM contacts WHERE id=?")
    .bind(String(body.contact_id || "")).first();
  if (!c) return err("Contact not found.",404);
  if (!c.call_allowed || c.status==="do_not_call" || !goodZone(c.timezone))
    return err("This number has not been cleared for calling.",403);
  if (!allowedNow(c.timezone)) return err("Contact is outside the permitted 8 AM–9 PM local calling window.",403);
  const now = Math.floor(Date.now()/1000);
  const dateParts = new Intl.DateTimeFormat("en-US",{
    timeZone:c.timezone,year:"numeric",month:"2-digit",day:"2-digit"
  }).formatToParts(new Date());
  const getPart = type => dateParts.find(p => p.type===type)?.value || "";
  const today = getPart("year")+"-"+getPart("month")+"-"+getPart("day");
  if (c.follow_up_at && c.follow_up_at>today)
    return err("This contact has a future follow-up date.",403);
  if (!["new","no_answer","voicemail","callback"].includes(c.status))
    return err("This contact is not in the active call queue.",403);
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM dial_intents WHERE created_at > ?")
    .bind(now-60).first();
  if ((recent?.n || 0)>=6) return err("Dialing limited to six authorizations per minute.",429);
  const duplicate = await env.DB.prepare("SELECT COUNT(*) AS n FROM dial_intents WHERE contact_id=? AND created_at>?")
    .bind(c.id,now-600).first();
  if ((duplicate?.n || 0)>0) return err("Wait ten minutes before redialing this number.",429);
  const dialToken = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO dial_intents (id,contact_id,created_at,expires_at) VALUES (?,?,?,?)"
  ).bind(dialToken,c.id,now,now+90).run();
  return json({dialToken});
}
async function voice(req,env) {
  if (req.method!=="POST") return xml("<Response><Hangup/></Response>",405);
  const raw = await req.text();
  if (raw.length>16000) return xml("<Response><Hangup/></Response>",413);
  const params = new URLSearchParams(raw);
  if (!(await validateTwilio(req,env,params)) || params.get("AccountSid")!==env.TWILIO_ACCOUNT_SID)
    return xml("<Response><Hangup/></Response>",403);
  const dialToken = params.get("DialToken");
  if (!dialToken || !/^[0-9a-f-]{36}$/i.test(dialToken))
    return xml("<Response><Hangup/></Response>",403);
  // One-time authorization: atomic claim rejects replay, expiry, and concurrent use.
  const claimed = await env.DB.prepare(
    "UPDATE dial_intents SET used_at=? WHERE id=? AND used_at IS NULL AND expires_at>=? RETURNING contact_id"
  ).bind(Math.floor(Date.now()/1000),dialToken,Math.floor(Date.now()/1000)).first();
  if (!claimed) return xml("<Response><Hangup/></Response>",403);
  const c = await env.DB.prepare("SELECT phone,status,call_allowed,timezone FROM contacts WHERE id=?")
    .bind(claimed.contact_id).first();
  if (!c || !c.call_allowed || c.status==="do_not_call" || !allowedNow(c.timezone))
    return xml("<Response><Hangup/></Response>",403);
  if (!/^\+1[2-9][0-9]{2}[2-9][0-9]{6}$/.test(env.TWILIO_FROM_NUMBER || ""))
    return xml("<Response><Hangup/></Response>",503);
  // No record, voicemail drop, multiple lines, or special TwiML verbs.
  const doc = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<Response><Dial callerId="'+env.TWILIO_FROM_NUMBER+'" answerOnBridge="true" timeout="30">' +
    '<Number>'+c.phone+'</Number></Dial></Response>';
  return xml(doc);
}
export default {
  async fetch(req,env) {
    const path = new URL(req.url).pathname;
    if (path==="/voice") {
      try { return await voice(req,env); }
      catch (e) { console.error("Voice webhook failed:",e); return xml("<Response><Hangup/></Response>",500); }
    }
    const origin = req.headers.get("Origin");
    if (origin && origin!==env.ALLOWED_ORIGIN) return err("Origin not allowed.",403);
    if (req.method==="OPTIONS") return cors(new Response(null,{status:204}),origin);
    if (!path.startsWith("/api/")) return err("Not found.",404);
    const authorization = req.headers.get("Authorization") || "";
    if (!env.OPERATOR_KEY || !authorization.startsWith("Bearer ") ||
        !(await secureEqual(authorization.slice(7),env.OPERATOR_KEY)))
      return cors(err("Invalid access key.",401),origin);
    try {
      if (!env.DB) return cors(err("D1 binding not configured.",503),origin);
      let result;
      if (req.method==="GET" && path==="/api/contacts") result=await contacts(env);
      else if (req.method==="POST" && path==="/api/import") result=await importContacts(req,env);
      else if (req.method==="PATCH" && /^\/api\/contacts\/[a-z0-9-]+$/i.test(path))
        result=await patchContact(req,env,path.split("/").pop());
      else if (req.method==="POST" && path==="/api/dispositions") result=await disposition(req,env);
      else if (req.method==="POST" && path==="/api/authorize") result=await authorize(req,env);
      else if (req.method==="POST" && path==="/api/token") {
        const vars = ["TWILIO_API_KEY_SID","TWILIO_ACCOUNT_SID","TWILIO_TWIML_APP_SID","TWILIO_API_KEY_SECRET"];
        result=vars.every(k=>env[k])?json({token:await signJwt(env)}):err("Twilio not configured.",503);
      }
      else result=err("Not found.",404);
      return cors(result,origin);
    } catch(e) {
      console.error("Dialer API:",e);
      return cors(err(e.message==="Request too large."?"Request too large.":"Request failed.",e.message==="Request too large."?413:500),origin);
    }
  }
};
