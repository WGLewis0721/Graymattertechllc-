-- Private D1 database. Do not commit prospect data or call logs to the website.
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT '',
  timezone TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','connected','no_answer','voicemail','callback','not_interested','do_not_call')),
  call_allowed INTEGER NOT NULL DEFAULT 0 CHECK(call_allowed IN (0,1)),
  eligibility_note TEXT NOT NULL DEFAULT '',
  reviewed_at TEXT,
  follow_up_at TEXT,
  last_contacted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status,call_allowed,follow_up_at);
CREATE TABLE IF NOT EXISTS dial_intents (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_dial_intents_contact ON dial_intents(contact_id,created_at);
CREATE TABLE IF NOT EXISTS call_outcomes (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  outcome TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  follow_up_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_call_outcomes_contact ON call_outcomes(contact_id,created_at);
