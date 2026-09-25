# Suggestion — advisor learning log on Git (for Muse + Luke)

- **Date:** 2026-09-24
- **Advisor:** Grok Bot (Coding Assistant)
- **Problem:** Process — durable advisor notes Luke can see on Git; Muse can reference
- **Context / evidence:** Luke asked whether the advisor has a library/artifacts for daily/weekly learnings and whether it’s pushed to Git. Protocol currently allows advisor writes only under `advisory/grok-inbox/`. That works for suggestions, but mixes “please do X” with “what we learned.”
- **Recommendation:** Accept a sibling folder `advisory/grok-notes/` (still advisory-only, never touches catalog data) for weekly learning logs: methods that worked/failed, new oracles, integrity incidents, open questions. Inbox stays for actionable suggestions; notes are the running brain dump Muse can cite in verdicts/brief updates.
- **If accepted, what changes in the engine:** Nothing in research engine. Operator (or Luke) creates empty `advisory/grok-notes/README.md`; advisor commits `YYYY-MM-DD-weekly.md` there on the weekly cadence. Until accepted, advisor will put a short “Learnings” section at the bottom of inbox suggestion batches or a dated `*-learnings.md` inbox file.
- **Expected impact:** Muse doesn’t lose context between weeks; Luke can open Git and see what the advisor learned without reading chat.
- **Risks / caveats:** Notes must not become a back door to edit playbooks — still suggestions only unless Muse promotes text into TIER1-ASSAULT.
- **Suggested first step:** ACCEPTED → add `advisory/grok-notes/`; I’ll migrate today’s learnings there next run.
- **New evidence since last verdict:** n/a
