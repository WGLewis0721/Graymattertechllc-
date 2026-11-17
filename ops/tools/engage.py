#!/usr/bin/env python3
"""Gray Matter engagement generator: from a qualified lead to quote, invoices and handoff.

Client folders are private. They live in $GM_CLIENTS_DIR (default
ops/delivery/private/clients/, gitignored) and never in this public repository.

  python3 ops/tools/engage.py kits
  python3 ops/tools/engage.py new --client "Business" --contact "Name" --email a@b.c --kit website \
        [--item website-growth] [--add addon-seo=500] [--price workflow-automation=1200] [--lead L0004]
  python3 ops/tools/engage.py invoice <client-slug> deposit|balance
  python3 ops/tools/engage.py status
"""
import argparse
import datetime as dt
import json
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DELIVERY = ROOT / "ops" / "delivery"
TEMPLATES = DELIVERY / "templates"
KITS = DELIVERY / "starter-kits"
FIT_CHECK = "Price confirmed after a quick fit check"
DOCS = ["PROPOSAL", "QUOTE", "ONBOARDING", "QA_CHECKLIST", "HANDOFF", "CHANGE_REQUEST", "CLOSEOUT"]
MAINT_KITS = {"website"}


def clients_dir():
    d = Path(os.environ.get("GM_CLIENTS_DIR", DELIVERY / "private" / "clients"))
    d.mkdir(parents=True, exist_ok=True)
    return d


def price_book():
    return json.loads((DELIVERY / "price-book.json").read_text(encoding="utf-8"))


def kit(kit_id):
    path = KITS / kit_id / "kit.json"
    if not path.exists():
        sys.exit(f"no kit '{kit_id}'. Run: engage.py kits")
    return json.loads(path.read_text(encoding="utf-8"))


def money(n):
    return f"${n:,.2f}".replace(".00", "")


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def next_number(prefix):
    counter = clients_dir() / ".counters.json"
    data = json.loads(counter.read_text()) if counter.exists() else {}
    key = f"{prefix}-{dt.date.today().year}"
    data[key] = data.get(key, 0) + 1
    counter.write_text(json.dumps(data, indent=2))
    return f"{key}-{data[key]:03d}"


def parse_pairs(pairs):
    out = {}
    for p in pairs or []:
        key, sep, val = p.partition("=")
        if not sep:
            sys.exit(f"expected item=amount, got '{p}'")
        try:
            out[key] = float(val.replace(",", "").replace("$", ""))
        except ValueError:
            sys.exit(f"amount for {key} is not a number: '{val}'")
    return out


def build_lines(k, items, adds, prices):
    """Return priced lines. Every line must end with a concrete amount or the quote is refused."""
    book = price_book()["items"]
    chosen = [{"item": i, "qty": 1} for i in items] if items else list(k["default_lines"])
    chosen += [{"item": a, "qty": 1} for a in adds]
    lines, missing = [], []
    for line in chosen:
        entry = book.get(line["item"])
        if not entry:
            sys.exit(f"'{line['item']}' is not in price-book.json")
        listed = entry["price"]
        if line["item"] in prices:
            amount = prices[line["item"]]
            if isinstance(listed, (int, float)) and amount < listed and entry.get("price_type") == "from":
                sys.exit(f"{line['item']} starts at {money(listed)}; {money(amount)} is below the published price")
            if isinstance(listed, list) and not listed[0] <= amount <= listed[1]:
                sys.exit(f"{line['item']} is published as {money(listed[0])}-{money(listed[1])}; "
                         f"{money(amount)} is outside it. Change pricing.html first if this is intended.")
        elif isinstance(listed, (int, float)):
            amount = float(listed)
        else:
            missing.append(line["item"])
            continue
        unit = f" per {entry['unit']}" if entry.get("unit") else ""
        lines.append({"item": line["item"], "name": entry["name"] + unit, "qty": line["qty"],
                      "amount": amount, "recurring": bool(entry.get("unit"))})
    if missing:
        sys.exit("set a fit-check price before quoting: " +
                 " ".join(f"--price {m}=<amount>" for m in missing) + f"\n({FIT_CHECK})")
    return lines


def line_table(lines):
    rows = ["| Item | Qty | Amount |", "|---|---|---|"]
    rows += [f"| {l['name']} | {l['qty']} | {money(l['amount'] * l['qty'])} |" for l in lines]
    return "\n".join(rows)


def fill(name, values):
    text = (TEMPLATES / f"{name}.md").read_text(encoding="utf-8")
    return re.sub(r"\{\{(\w+)\}\}", lambda m: str(values.get(m.group(1), m.group(0))), text)


def lead_values(lead_id):
    """Pull client facts from the private lead store when a lead id is given."""
    sys.path.insert(0, str(Path(__file__).parent))
    import leads  # noqa: PLC0415
    lead = leads.find(leads.load(), lead_id)
    return lead


def cmd_kits(_):
    book = price_book()["items"]
    for path in sorted(KITS.glob("*/kit.json")):
        k = json.loads(path.read_text(encoding="utf-8"))
        prices = []
        for line in k["default_lines"]:
            p = book[line["item"]]["price"]
            prices.append(money(p) if isinstance(p, (int, float)) else "fit check")
        print(f"{k['id']:<20} {k['service']:<28} {', '.join(prices):<12} {k['timeline']}")


def cmd_new(a):
    k = kit(a.kit)
    if a.lead:
        lead = lead_values(a.lead)
        a.client = a.client or lead["business"]
        a.contact = a.contact or lead["contact_name"]
        a.email = a.email or lead["email"]
        a.phone = a.phone or lead["phone"]
        a.problem = a.problem or lead["problem"]
    if not a.client:
        sys.exit("--client is required (or --lead)")
    slug = slugify(a.client)
    folder = clients_dir() / slug
    if folder.exists():
        sys.exit(f"{folder} already exists")
    prices = parse_pairs(a.price)
    adds = []
    for add in a.add or []:
        item, sep, amount = add.partition("=")
        adds.append(item)
        if sep:
            prices.update(parse_pairs([add]))
    lines = build_lines(k, a.item, adds, prices)
    one_time = sum(l["amount"] * l["qty"] for l in lines if not l["recurring"])
    monthly = sum(l["amount"] * l["qty"] for l in lines if l["recurring"])
    deposit = round(one_time * price_book()["terms"]["deposit_percent"] / 100, 2)
    book = price_book()["items"]
    first = book[lines[0]["item"]]
    today = dt.date.today()
    values = {
        "client_name": a.client, "client_contact": a.contact or "", "client_email": a.email or "",
        "client_phone": a.phone or "", "project_name": a.project or f"{k['name'].replace(' Starter Kit', '')} for {a.client}",
        "service_name": k["name"].replace(" Starter Kit", ""), "kit": k["id"], "date": today.isoformat(),
        "doc_number": next_number("Q"), "valid_until": (today + dt.timedelta(days=30)).isoformat(),
        "line_items": line_table(lines), "total": money(one_time) + (f" + {money(monthly)}/month" if monthly else ""),
        "deposit": money(deposit), "balance": money(one_time - deposit),
        "timeline": first.get("timeline") or k["timeline"],
        "revision_rounds": first.get("revision_rounds", "as stated in the proposal"),
        "problem": a.problem or "{{problem}}", "outcome": "{{outcome}}",
        "scope_included": "{{scope_included}}", "scope_excluded": "{{scope_excluded}}",
        "client_inputs": "{{client_inputs}}", "notes": "{{notes}}",
    }
    folder.mkdir(parents=True)
    for name in DOCS:
        (folder / f"{name}.md").write_text(fill(name, values), encoding="utf-8")
    if k["id"] in MAINT_KITS:
        (folder / "MAINTENANCE_PLAN.md").write_text(fill("MAINTENANCE_PLAN", values), encoding="utf-8")
    shutil.copy(KITS / k["id"] / "KIT.md", folder / "KIT_CHECKLIST.md")
    state = {"client": a.client, "slug": slug, "kit": k["id"], "lead": a.lead or "", "created": today.isoformat(),
             "quote": values["doc_number"], "lines": lines, "one_time": one_time, "monthly": monthly,
             "deposit": deposit, "paid": 0, "invoices": [], "values": values}
    (folder / "engagement.json").write_text(json.dumps(state, indent=2), encoding="utf-8")
    print(f"{folder}\n  quote {values['doc_number']}: {values['total']} (deposit {values['deposit']})")
    hand = sorted({m for f in folder.glob('*.md') for m in re.findall(r'\{\{\w+\}\}', f.read_text())})
    if hand:
        print("  fill by hand:", " ".join(hand))


def cmd_invoice(a):
    folder = clients_dir() / a.slug
    path = folder / "engagement.json"
    if not path.exists():
        sys.exit(f"no engagement '{a.slug}'")
    st = json.loads(path.read_text(encoding="utf-8"))
    if any(i["for"] == a.stage for i in st["invoices"]):
        sys.exit(f"a {a.stage} invoice already exists for {a.slug}")
    if a.stage == "balance" and not any(i["for"] == "deposit" for i in st["invoices"]):
        sys.exit("issue the deposit invoice first")
    amount = st["deposit"] if a.stage == "deposit" else round(st["one_time"] - st["deposit"], 2)
    paid = 0 if a.stage == "deposit" else st["deposit"]
    today = dt.date.today()
    number = next_number("INV")
    values = dict(st["values"], doc_number=number, date=today.isoformat(),
                  due_date=(today + dt.timedelta(days=7)).isoformat(), amount_due=money(amount),
                  amount_paid=money(paid), total=money(st["one_time"]),
                  invoice_for="Deposit (50%, non-refundable)" if a.stage == "deposit"
                  else "Balance due on completion, before final files or launch")
    (folder / f"INVOICE-{number}.md").write_text(fill("INVOICE", values), encoding="utf-8")
    st["invoices"].append({"number": number, "for": a.stage, "amount": amount, "date": today.isoformat()})
    path.write_text(json.dumps(st, indent=2), encoding="utf-8")
    print(f"{folder / f'INVOICE-{number}.md'}: {money(amount)} due {values['due_date']}")


def cmd_status(_):
    for path in sorted(clients_dir().glob("*/engagement.json")):
        st = json.loads(path.read_text(encoding="utf-8"))
        inv = ", ".join(f"{i['for']} {i['number']}" for i in st["invoices"]) or "no invoices"
        print(f"{st['slug']:<28} {st['kit']:<18} {money(st['one_time']):>10}  {inv}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("kits").set_defaults(fn=cmd_kits)
    p = sub.add_parser("new")
    p.add_argument("--client")
    p.add_argument("--contact")
    p.add_argument("--email")
    p.add_argument("--phone")
    p.add_argument("--project")
    p.add_argument("--problem")
    p.add_argument("--kit", required=True)
    p.add_argument("--lead")
    p.add_argument("--item", action="append", help="price-book item replacing the kit default (repeatable)")
    p.add_argument("--add", action="append", help="price-book add-on, optionally item=amount (repeatable)")
    p.add_argument("--price", action="append", help="item=amount for fit-check or range items (repeatable)")
    p.set_defaults(fn=cmd_new)
    p = sub.add_parser("invoice")
    p.add_argument("slug")
    p.add_argument("stage", choices=["deposit", "balance"])
    p.set_defaults(fn=cmd_invoice)
    sub.add_parser("status").set_defaults(fn=cmd_status)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
