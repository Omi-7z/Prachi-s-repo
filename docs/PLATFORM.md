# Karigar: how the platform works

Karigar helps craft artisans explain their own expertise to buyers, customers and institutions, in their own words and language. The work starts in a facilitated, in-person session on a physical card board (the **Ludo Mandala**). An organisation runs that session. Software then turns the session into a private practice app that the artisan keeps on their phone.

The goal is pride, not marketing copy. Artisans often lose confidence when new markets make demands of them. The board shows what they are already expert in, and the app helps them say it out loud.

---

## 1. The three parts

| Part | Who uses it | What it is |
| --- | --- | --- |
| **Website** | Public, prospective partner organisations | Explains the toolkit and invites organisations to run a pilot. |
| **Organisation console** | Facilitators and programme staff | Brings in session records, analyses them, hands over to artisans and tracks results. |
| **Artisan app** | The artisan | A private practice space on their phone, opened from a link. Nothing to install from a store; the artisan signs in with a username and password their facilitator sets up. |

All three share one record: the artisan's **mandala board**.

---

## 2. The mandala board (the shared record)

The board is made of six rings, running from the craft itself out to its future. Each card is a dot on a ring. The cards come in three decks:

- **Theme cards** cover Identity, Place, Legacy, Material, Process, Market and Future, and build the identity map of the craft.
- **Reflection cards** record what the artisan decided matters after sharing: their strength, their concern, their sharing rules and boundaries, and their hopes for the future. These answers decide how everything else is written.
- **Small story modules** are concrete incidents, such as a moment that taught them something, a moment that stayed with them, or what outsiders should understand. One scene is worth more than any number of adjectives.

Facilitators can also **add their own question** to any ring when the session raises something that no card asks.

A session only counts as **complete** when it reaches all three decks. Theme cards on their own give you a craft. The reflection and story cards give you a person.

---

## 3. The organisation console

### Overview: "Is the toolkit working?"
- **Four measures:**
  - Reached all three decks
  - Read back and agreed by the artisan
  - App opened by the artisan
  - Artisan came back to practise
- **Needs your attention:** a list of named artisans, each with a specific next step (for example: session incomplete, never analysed, not yet approved, link never opened, inactive for N days).
- **What artisans choose to practise:** counts only. What they actually said stays on their phone.
- **Facilitation quality by cluster:** shows completion, approval, weekly use and a risk level for each craft and region.

### Mandala board
- Lays the session back onto the board it came from. You can tap any dot to read or fill in that card.
- Brighter dots mean more artisans have answered that card.
- You can connect reflection and story cards to rings, and add custom questions.

### New profile: bring the session in
There are three ways to bring a session in: **upload** a transcript or recording, **paste** a transcript, or **type it in yourself**.

The agent then:
- Matches each answer to the card it belongs to
- Keeps the artisan's own words rather than paraphrasing them
- Attaches the source line, so the facilitator can check it
- Leaves a card empty when the session didn't reach it. Nothing is invented.

### Analysis: the communication profile
The agent turns the session into:
- What they can already say well
- Where they go quiet
- Which practice rooms to open first
- Their own words to keep
- Things to handle with care
- What the artisan will see

Ground rules apply to every result:
- The artisan is an author, not a heritage symbol.
- Their own vocabulary is kept.
- Poverty and tradition are never romanticised. Phrases like "timeless" and "dying art" are banned.
- Concerns are reported plainly.

### Handover
- The artisan gets a **link and a QR code**, not an install.
- **Checklist before handing over:**
  1. Read the profile back in their language and change what they disagree with.
  2. Confirm what can be shared publicly.
  3. Add the app to their home screen together.
  4. Do one practice conversation with them.
  5. Agree who they should call if something feels wrong.

### Artisans: manage and troubleshoot
- Search by name, craft or region. See cards captured, app language, practice runs and when they last opened the app.
- **Status values:** Live, Session incomplete, Awaiting analysis, Awaiting approval, Access revoked.
- **Fixes:**
  - Revoke or restore access
  - Issue a new link
  - Mark the profile as agreed, or withdraw approval
  - Clear and re-run the analysis
  - Reset their practice history
  - Delete the profile (the link stops working immediately)

---

## 4. The artisan app

The artisan opens the app from their personal link and can add it to their home screen. Once added, it opens like an app with its own icon. Their board can be read without internet.

- **Home: "Your work, your words."** Shows what their board revealed about their work, and a button to start a practice conversation.
- **Practice:**
  1. The artisan chooses who to practise talking to: a brand or buyer, a young customer online, a social enterprise, an NGO, an exhibition, or **anyone they name themselves** (for example, "a shop owner in Ahmedabad").
  2. They pick a **goal** for the conversation, or write their own.
  3. The other side talks back like the real thing: it asks questions, bargains and doubts. A **hint** gives a nudge, not an answer.
  4. **"How did I do?"** gives one thing they did well, one sentence to try next time, and one thing from their board they forgot to use.
- **My board:** the full mandala, in their words.
- **Profile and settings:** app language, text size, add to home screen, clear practice history.
- **Privacy:** practice conversations stay on the phone. The organisation only sees how many conversations there have been.

The app works in the artisan's language. Names and place names are transliterated, not translated. Local craft terms, such as *bandhej* and *dhokra*, are kept as they are.

---

## 5. End-to-end flow

1. **Session:** a facilitator runs the mandala board with the artisan, in person.
2. **Capture:** the facilitator uploads or pastes the session in the console, and the agent fills in the cards.
3. **Review:** the facilitator checks the source lines and fills any gaps.
4. **Analyse:** the agent produces the communication profile.
5. **Read back:** the profile is read to the artisan, who approves it or asks for changes.
6. **Handover:** the link or QR code goes onto the artisan's phone, and they do a first practice together.
7. **Practice:** the artisan returns on their own and rehearses real conversations.
8. **Track:** the console shows who opened the app, who came back, and who needs help next.

---

## 6. Behind the scenes (for the build team)

- **Repo:** `Omi-7z/Prachi-s-repo`, live at karigar-toolkit.vercel.app.
- **Accounts:** facilitator sign-in. Profiles are stored in Postgres.
- **Artisan links:** served at `/k/:token`. Links can be revoked or reissued at any time.
- **AI calls:** session reading, analysis, translation, practice conversations, hints and feedback all go through a server-side chat bridge.
- **Design files:**
  - `Karigar Ecosystem.dc.html`: website
  - `Karigar Ecosystem Console.dc.html`: console and artisan app
  - `karigar-data.js`: card schema
  - `karigar-i18n.js`: interface text in every language

---

## 7. Brand mark

The logo is a set of open, concentric arcs in yellow, blue, red, maroon, green and lavender, with a trail of yellow dots that closes the outer ring. The master file is `media/karigar-logo.svg`. It replaces the earlier concentric-circle mark across the website, the console and the artisan app.
