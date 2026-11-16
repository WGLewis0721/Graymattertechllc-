# Template fields

Templates use `{{field}}` placeholders. `ops/tools/engage.py` fills the ones
marked auto; fill the rest by hand. Use only these names.

| Field | Filled | Meaning |
|---|---|---|
| `{{client_name}}` | auto | Business name |
| `{{client_contact}}` | auto | Person we deal with |
| `{{client_email}}` `{{client_phone}}` | auto | Contact details |
| `{{project_name}}` | auto | Short project title |
| `{{service_name}}` | auto | Gray Matter service, from the starter kit |
| `{{kit}}` | auto | Starter kit id |
| `{{date}}` | auto | Issue date |
| `{{doc_number}}` | auto | Quote, estimate or invoice number |
| `{{valid_until}}` | auto | Quote expiry date |
| `{{line_items}}` | auto | Table of items and amounts |
| `{{total}}` `{{deposit}}` `{{balance}}` | auto | Money, from the line items and agreement terms |
| `{{timeline}}` | auto | From the price book, or "Confirmed after a quick fit check" |
| `{{revision_rounds}}` | auto | From the price book or the proposal |
| `{{problem}}` | hand | The problem in the client's words |
| `{{outcome}}` | hand | What will be true when we finish |
| `{{scope_included}}` `{{scope_excluded}}` | hand | Bulleted scope |
| `{{client_inputs}}` | hand | What we need from the client |
| `{{notes}}` | hand | Anything else |

Gray Matter's own details are written out, not templated: Gray Matter LLC,
Montgomery, Alabama, graymattertechllc@gmail.com, (334) 652-2601,
https://graymatterdigitalsolutions.com.
