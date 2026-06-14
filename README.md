# TaskQuest ⚔️

A gamified productivity app built with React, inspired by RPG quest systems. Manage your tasks as quests, earn XP for completing them, and level up your productivity — one commit at a time.

---

## Live Demo

🔗 [taskquest-three.vercel.app]

---

## Screenshots

### Desktop

| Empty state | Quests added | Completed quests |
|---|---|---|
| ![Empty state — no quests, 0 XP](Screenshot_2026-06-14_at_8_35_35_PM.png) | ![Quest log with active quests](Screenshot_2026-06-14_at_8_38_10_PM.png) | ![Completed quests with XP earned](Screenshot_2026-06-14_at_8_38_50_PM.png) |

**Confirmation dialog — delete protection**

![Browser confirmation dialog before quest deletion](Screenshot_2026-06-14_at_8_39_15_PM.png)

### Mobile

![Mobile view — responsive single-column layout with 30 XP progress](Screenshot_2026-06-14_at_8_43_23_PM.png)

---

## The Idea

TaskQuest grew out of a question I kept asking while building React apps: *What would a to-do list feel like if it was designed by a game studio?*

The UI borrows from RPG quest logs — tasks become quests, completions earn XP, and your progress persists between sessions. But beneath the aesthetic, the real design driver was QA thinking: every input, action, and state transition was considered from the perspective of how it could break or frustrate a user.

---

## Features

- **Quest creation** with input validation — empty submissions are blocked
- **Duplicate detection** — prevents identical quests from cluttering your log
- **Confirmation dialogs** before destructive actions (quest deletion)
- **XP progression system** — earn experience for completing quests
- **Persistent state** via `localStorage` — progress survives page refreshes
- **RPG-inspired UI** — quest log aesthetic with a clean, responsive layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| State | React Hooks (`useState`, `useEffect`) |
| Persistence | `localStorage` |
| Styling | Plain CSS (custom properties, flexbox, responsive) |
| Deployment | Vercel |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Yogita-96/taskquest.git
cd taskquest

# Install dependencies
npm install

# Start the development server
npm start
```

App runs at `http://localhost:3000`

---

## Project Structure

```
taskquest/
├── public/
├── src/
│   ├── App.js            # Root component — all state, logic, and UI
│   ├── App.css           # All styles (dark theme, XP bar, quest cards, responsive)
│   └── index.js          # Entry point
├── package.json
└── README.md
```

## Implementation Notes

A few deliberate decisions worth noting:

- **Lazy state initializers** — both `quests` and `xp` read from `localStorage` on first render only, using the `useState(() => ...)` initializer pattern to avoid re-reading on every render
- **XP bar cap** — `Math.min(xp, 100)` keeps the progress bar visually bounded while the raw XP value continues to grow
- **Case-insensitive duplicate check** — `q.text.toLowerCase() === task.toLowerCase()` catches "Buy milk" and "buy milk" as the same quest
- **`window.confirm` for deletion** — a deliberate choice to use the browser's native dialog, keeping the implementation simple while still requiring intentional user action
- **Single `useEffect`** — both `quests` and `xp` sync to `localStorage` in one effect, keeping persistence logic in one place

---



This project was deliberately built with **QA-first thinking** applied to frontend development:

- **Expect unexpected input** — validate before processing
- **Protect state consistency** — catch duplicates before they cause confusion
- **Make destructive actions reversible** — confirm before deleting
- **Respect continuity** — users shouldn't lose progress on refresh

These aren't just React best practices. They're lessons from functional QA work on shipped game titles, applied to the product layer of a web app.

---

## About the Author

Frontend developer with a background in game FQA (Ubisoft, Bandai Namco titles via Globalstep). Currently building in React while exploring game development with Unity and Unreal Engine.

- 🌐 Portfolio: [Add Portfolio Link]
- 💼 LinkedIn: [[](https://www.linkedin.com/in/yogita-m/)]
- 🎮 MobyGames: [[](https://www.mobygames.com/person/1835643/yogita-yogita/)]

---

## License

MIT
