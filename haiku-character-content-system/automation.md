# Automation Stack (80% of the Work)

## Tools

- **Notion**: Source of truth (Situations database, Posted database, Suggested Situations, Taste Profile page)
- **Google Drive**: File system (Character_Ref, Motion_Graphics, Character_Clips, Scripts, Final_Ready_to_Post)
- **n8n or Make**: Orchestration (Notion ↔ Claude/Grok ↔ Drive ↔ posting)
- **Claude / Grok**: Script drafting, performance analysis, preference extraction
- **Posting**: n8n/Make + platform APIs or Buffer/Metricool

## Daily Automated Flow

1. Pull next “Scripted” item from Notion.
2. Send script + character notes to Claude/Grok with locked system prompt.
3. Write refined script back to Notion and save .txt in Drive Scripts folder.
4. (Human or later automation) generate video from script → drop in Final_Ready_to_Post.
5. Watch folder → post to TikTok/Reels → update Notion status to Posted.

## Weekly Automated Analysis

- Pull performance data.
- Send to Claude/Grok with instruction to rank situations, identify patterns, suggest 5–8 new ideas.
- Write suggestions into Notion “Suggested Situations” as Needs Approval.

## Monthly

- Export 30 days to Sheet.
- Claude reviews and returns pattern observations + variations.
- Approved items feed back into Situations database.

Human time is reserved for approval of situations, final clip check, and occasional taste corrections.