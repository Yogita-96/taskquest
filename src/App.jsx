import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useLevelSystem } from "./hooks/useLevelSystem";
import "./App.css";

function App() {
  const [task, setTask] = useState("");

  const [quests, setQuests] = useState(() => {
    const savedQuests = localStorage.getItem("quests");
    return savedQuests ? JSON.parse(savedQuests) : [];
  });

  const { levelInfo, showLevelUp, newTitle, addXP, dismissLevelUp } =
    useLevelSystem();

  useEffect(() => {
    localStorage.setItem("quests", JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    if (showLevelUp) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#14b8a6", "#22c55e", "#a78bfa", "#f59e0b", "#ffffff"],
      });
    }
  }, [showLevelUp]);

  const addQuest = () => {
    if (!task.trim()) {
      alert("Quest title cannot be empty!");
      return;
    }

    const duplicateQuest = quests.find(
      (q) => q.text.toLowerCase() === task.toLowerCase() && !q.completed
    );

    if (duplicateQuest) {
      alert("Duplicate quest detected!");
      return;
    }

    setQuests([
      ...quests,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const completeQuest = (id) => {
    setQuests(
      quests.map((quest) =>
        quest.id === id ? { ...quest, completed: true } : quest
      )
    );
    addXP(10);
  };

  const clearCompleted = () => {
    setQuests(quests.filter((quest) => !quest.completed));
  };

  const deleteQuest = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to abandon this quest?"
    );
    if (confirmDelete) {
      setQuests(quests.filter((quest) => quest.id !== id));
    }
  };

  // Sort: active quests first, completed quests at bottom
  const sortedQuests = [...quests].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="app">
      {showLevelUp && (
        <div className="levelup-banner" onClick={dismissLevelUp}>
          <div className="levelup-content">
            <span className="levelup-icon">⚔️</span>
            <span className="levelup-text">Level Up!</span>
            <span className="levelup-title">{newTitle}</span>
            <span className="levelup-hint">click to dismiss</span>
          </div>
        </div>
      )}

      <div className="sticky-header">
        <div className="container">
          <h1>🎮 TaskQuest</h1>
          <p className="subtitle">Gamified productivity powered by QA thinking.</p>

          <div className="xp-box">
            <div className="xp-header">
              <span className="player-title">{levelInfo.title}</span>
              <span className="level-badge">Level {levelInfo.level}</span>
            </div>
            <div className="xp-text">
              <span>XP Progress</span>
              <span>
                {levelInfo.xpIntoCurrentLevel} / {levelInfo.xpForCurrentLevel} XP
              </span>
            </div>
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${levelInfo.progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="task-input">
            <input
              type="text"
              placeholder="Enter a new quest..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addQuest()}
            />
            <button onClick={addQuest}>Add</button>
          </div>
        </div>
      </div>

      <div className="container">
        {quests.some((q) => q.completed) && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear Completed
          </button>
        )}
        <div className="quest-list">
          {sortedQuests.map((quest) => (
            <div className="quest-card" key={quest.id}>
              <span className={quest.completed ? "completed" : ""}>
                {quest.text}
              </span>
              <div className="buttons">
                {!quest.completed && (
                  <button
                    className="complete-btn"
                    onClick={() => completeQuest(quest.id)}
                  >
                    Complete
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteQuest(quest.id)}
                >
                  Abandon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;