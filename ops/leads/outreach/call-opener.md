---
channel: phone
step: any
---
"Hi, is this {{first_name}}? This is {{sender_name}} with Gray Matter here in Montgomery. I'll be quick: {{observation}} Is that something you've been meaning to fix, or is it fine the way it is?"

If yes: "What happens today when {{problem_short}}?" Then: "Would a fifteen-minute look at options be useful? I can do {{proposed_time}}."
If no: "Understood. Thanks for your time." Log it as nurture or lost.
