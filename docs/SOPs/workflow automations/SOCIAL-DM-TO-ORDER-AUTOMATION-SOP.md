# Gray Matter SOP — Social DM to Order Automation

**Service:** Workflow Automation  
**Use Case:** Facebook / Instagram-first businesses that want to keep personally talking to customers while automating order tracking, reminders, status updates, and follow-up.  
**Primary Stack:** ManyChat + n8n + Airtable + the client's existing booking/payment tools

---

## 1. Goal

Build a workflow where:

- Customer messages the business on Facebook Messenger or Instagram DM.
- Customer receives a simple automatic acknowledgment.
- Business owner continues the real conversation personally.
- Owner marks the conversation as an order when the customer is ready.
- Customer and order information is automatically saved.
- Customer receives the next required action: form, booking link, payment link, or information request.
- Order status is tracked from start to finish.
- Customer receives appropriate status updates.
- Owner receives reminders when an order is stalled.
- Completed customers receive a thank-you and review request.

**Important:** AI does not have to replace the owner's voice. The automation should handle the administrative work around the conversation.

---

## 2. Standard Technology Stack

- **Facebook Messenger / Instagram DM** — customer conversation channel
- **ManyChat** — social inbox, automated acknowledgment, tags, conversation handoff, basic DM automation
- **n8n** — core workflow automation and integrations
- **Airtable** — customer and order database
- **Client's existing systems** — Stripe, Square, Acuity, Calendly, Google Workspace, etc.
- **Email / SMS / DM notifications** — confirmations, reminders, and status updates

### Standard Architecture

Customer DM  
→ ManyChat  
→ n8n  
→ Airtable  
→ Booking / Payment / Client Tools  
→ Customer + Owner Notifications

---

## 3. Information Required From Client

Before building, collect:

- Facebook Business Page access
- Instagram Business account access, if applicable
- ManyChat account or permission to create/connect one
- Existing booking system
- Existing payment system
- Business email
- Business phone/SMS system, if text messaging will be used
- Current order process
- Order statuses the owner uses
- Customer information that must be collected
- When customers should receive automatic messages
- When the owner wants to communicate personally instead
- Review link, if available

---

## 4. Build Procedure

### Step 1 — Map the Current Process

Write the client's existing process in simple terms:

- Customer sends DM.
- Owner replies.
- Customer asks to order/book.
- Owner collects information.
- Customer pays/books.
- Owner completes work.
- Owner tells customer it is ready/complete.
- Customer receives product/service.

Identify where information is currently being lost, forgotten, delayed, or manually repeated.

---

### Step 2 — Define Order Statuses

Use the simplest statuses possible.

Default Gray Matter status model:

- New
- Awaiting Customer
- Confirmed
- In Progress
- Ready
- Completed
- Cancelled

Do not add extra statuses unless the client's business actually needs them.

---

### Step 3 — Create Airtable Database

Create two primary tables.

#### Customers

Include:

- Customer ID
- Name
- Phone
- Email
- Facebook / Instagram username
- Preferred contact channel
- First contact date
- Last contact date
- Notes

#### Orders

Include:

- Order ID
- Customer
- Order type
- Order description
- Order status
- Order date
- Scheduled date/time
- Amount
- Payment status
- Booking status
- Assigned staff member, if applicable
- Last customer update
- Next action
- Completion date

---

### Step 4 — Connect Facebook / Instagram to ManyChat

- Connect the client's Facebook Business Page.
- Connect Instagram Business account when applicable.
- Confirm incoming DMs appear correctly.
- Configure a short automatic acknowledgment.

Example:

> Thanks for reaching out! We received your message and will get back to you shortly.

Do not make the initial automation sound like the business owner if the client wants to personally handle conversations.

---

### Step 5 — Create Human Handoff

Configure the system so the owner can continue the conversation normally.

Create a simple trigger such as:

- Tag: `Create Order`
- Tag: `Ready to Book`
- Tag: `Ready to Pay`

The owner should only need to perform one simple action to start the automated order workflow.

---

### Step 6 — Build n8n Order Workflow

When the owner applies the order trigger:

- Receive the event from ManyChat.
- Search Airtable for the customer.
- If customer exists, update the record.
- If customer does not exist, create the customer.
- Create a new order record.
- Set status to `New` or `Awaiting Customer`.
- Add conversation/customer details.
- Send owner confirmation that the order was created.

Include duplicate protection so the same customer/order is not created repeatedly.

---

### Step 7 — Send the Customer's Next Action

Based on the order type, automatically send one of the following:

- Booking link
- Payment link
- Intake/order form
- Address request
- Product options
- Quote approval
- Required documents

Whenever possible, use the client's existing tools rather than replacing systems that already work.

---

### Step 8 — Update Order Automatically

Connect the client's booking/payment/form systems to n8n.

Examples:

- Payment completed → `Confirmed`
- Appointment booked → `Confirmed`
- Intake form submitted → update customer/order information
- Payment failed → `Awaiting Customer`
- Appointment cancelled → `Cancelled`

Write the updated status back to Airtable.

---

### Step 9 — Notify the Owner

Send owner notifications only when useful.

Examples:

- New confirmed order
- Customer completed payment
- Customer submitted required information
- Order has been waiting too long
- Customer cancelled
- Follow-up required

Avoid creating excessive notifications.

---

### Step 10 — Configure Status Messages

Determine which status changes should automatically contact the customer.

Example rules:

- Confirmed → confirmation message
- In Progress → optional progress message
- Ready → ready-for-pickup / ready-for-delivery message
- Completed → thank-you message

The client may choose to personally send some or all of these messages.

---

### Step 11 — Create Stalled Order Reminders

Create an n8n scheduled workflow that checks Airtable.

Examples:

- Awaiting payment for 24 hours → remind owner or customer
- Awaiting customer information for 24 hours → follow up
- Confirmed order approaching due date → remind owner
- Order remains In Progress past expected completion → alert owner

Default to notifying the owner first unless the client explicitly approves automatic customer reminders.

---

### Step 12 — Complete the Order

When the owner marks the order `Completed`:

- Record completion date.
- Send thank-you message.
- Send review request after the chosen delay.
- Save the customer/order history.
- Stop all outstanding reminders for that order.

---

## 5. Required Testing

Before delivery, test the workflow as a customer from beginning to end.

Confirm:

- Facebook/Instagram message is received.
- Automatic acknowledgment fires once.
- Owner can personally take over conversation.
- Order trigger works.
- Customer record is created correctly.
- Existing customers are not duplicated.
- Order record is created correctly.
- Booking/form/payment link is correct.
- Payment/booking completion updates Airtable.
- Owner receives required notifications.
- Customer receives approved status messages.
- Stalled-order reminder works.
- Completed order stops reminders.
- Review request works.
- Failures are logged and visible.

Do not deliver until the complete workflow passes testing.

---

## 6. Client Approval

Demonstrate the workflow using one test order.

Show the client:

- What the customer sees
- What the owner still handles personally
- How to create an order
- How to change order status
- Where customer/order records live
- Which messages are automatic
- How to pause automation

Get approval before enabling the workflow for all customers.

---

## 7. Client Handoff

Provide:

- Airtable access
- ManyChat access
- Client-owned booking/payment system access confirmation
- Workflow diagram
- List of automatic messages
- Order status definitions
- Basic operating instructions
- Support contact/process

Critical business accounts should remain client-owned whenever possible. Gray Matter should receive the access needed to build and maintain the integration.

---

## 8. Ongoing Support

Offer the client an optional Workflow Automation Care plan covering:

- n8n workflow monitoring
- Failed automation troubleshooting
- API/integration changes
- Message updates
- New order statuses
- Additional automation requests
- Monthly workflow health check
- Airtable cleanup

---

## 9. Gray Matter Reusable Template

Save the completed implementation as a reusable template.

Suggested template name:

`GM-AUTO-SOCIAL-001 Social DM to Order`

Reusable workflow components:

- Social DM acknowledgment
- Human handoff
- Customer create/update
- Order creation
- Booking/payment trigger
- Status update
- Owner notification
- Stalled order reminder
- Completion workflow
- Review request

For future clients, clone the template, replace credentials, map their fields/statuses, customize approved messages, test, and deploy.

---

## 10. Definition of Done

The order is complete when:

- Customer can begin from Facebook or Instagram.
- Owner can keep personally communicating with the customer.
- Owner can convert a conversation into a tracked order with one simple action.
- Customer/order records are automatically organized.
- Booking/payment/forms connect correctly.
- Statuses update correctly.
- Approved customer messages send correctly.
- Owner reminders work.
- Completed orders are archived correctly.
- Client has approved the workflow.
- Client has access to the systems they own.
- Gray Matter has documented the implementation.
