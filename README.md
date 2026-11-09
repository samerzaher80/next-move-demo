# Next Move — Beyond the Chatbot

A non-chat, non-dashboard support workflow for DOO's **Beyond the Chatbot** mission. Open `index.html` or GitHub Pages. Run `npm test` for intent and recovery tests.

## Architecture

Four synthetic support signals enter a lightweight ranking and lexical scoring model. Priority combines impact and waiting time. Intent scores use weighted text features for outage, billing, and how-to; the margin between top classes sets an uncertainty flag. On load, the highest-priority item automatically becomes one proposed local task. The user sees only the next decision, its source sentence, confidence, and score explanation. Approval records a local task; rejection records no action; override records corrective feedback and the human-selected intent. No external message is sent.

## 90-second walkthrough

1. Load the page. The app has already surfaced the high-impact app-freeze incident without a chat prompt.
2. Approve the local triage task; the next signal appears. Review or reject it.
3. On the charger-failure signal, show the model's ambiguous classification. Choose **Wrong guess**, select Billing, and save the correction. The previous intent and chosen intent are both recorded.
4. Scroll to the screenshot of the synthetic dashboard this single-decision surface replaces.

## Failure test

The word *failed* can indicate an outage or a failed physical charger. A keyword model can guess wrong. Low classification margin triggers a clarification request, and the human override creates explicit feedback. A confident guess can still be overridden. No external action runs without review.

## Two-year thesis

For repeated work, the useful interface may be a sequence of context-rich decisions rather than a dashboard or a chat window. The system should infer the next likely task from events, explain why it surfaced that task, and propose only the action that needs human judgment. Confidence must be calibrated to the cost of being wrong; corrections should update the work record instead of disappearing into a chat transcript. In two years, these interfaces may resemble focused operational instruments: small surfaces that respond to changing context, preserve reasons, and make recovery as easy as approval. Chat will remain valuable for exploration, while routine operations can move to reviewable decisions.

Built with Codex assistance. Synthetic signals only. The scoring model is deliberately small and deterministic; it is not a trained classifier or a claim of production accuracy. `baseline.png` is a screenshot of `baseline.html`, a synthetic example built solely for this comparison.

Queue order is highest impact first, then longest wait at equal impact. The proposal explains the ranking rule.