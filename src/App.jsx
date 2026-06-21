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
    const confirmClear = window.confirm(
      "Clear all completed quests? This cannot be undone."
    );
    if (confirmClear) {
      setQuests(quests.filter((quest) => !quest.completed));
    }
  };

  const deleteQuest = (id, isCompleted) => {
    const confirmMessage = isCompleted
      ? "Remove this quest from your completed list? This cannot be undone."
      : "Are you sure you want to abandon this quest?";

    const confirmDelete = window.confirm(confirmMessage);
    if (confirmDelete) {
      setQuests(quests.filter((quest) => quest.id !== id));
    }
  };

  // Split into active and completed groups
  const activeQuests = quests.filter((q) => !q.completed);
  const completedQuests = quests.filter((q) => q.completed);

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

      <div className="container">
        <h1><span className="title-icon">⚔</span> TaskQuest</h1>
        <p className="subtitle">Gamified productivity powered by QA thinking.</p>
      </div>

      <div className="sticky-header">
        <div className="container">
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
        {activeQuests.length > 0 && (
          <>
            <div className="section-label">Active Quests</div>
            <div className="quest-list">
              {activeQuests.map((quest) => (
                <div className="quest-card active" key={quest.id}>
                  <span>{quest.text}</span>
                  <div className="buttons">
                    <button
                      className="complete-btn"
                      onClick={() => completeQuest(quest.id)}
                    >
                      Complete
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteQuest(quest.id, false)}
                    >
                      Abandon
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {completedQuests.length > 0 && (
          <>
            <div className="section-label completed-label">Completed</div>
            <button className="clear-btn" onClick={clearCompleted}>
              ✕ Clear Completed
            </button>
            <div className="quest-list">
              {completedQuests.map((quest) => (
                <div className="quest-card" key={quest.id}>
                  <span className="completed">{quest.text}</span>
                  <div className="buttons">
                    <button
                      className="delete-btn"
                      onClick={() => deleteQuest(quest.id, true)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {quests.length === 0 && (
          <p className="empty-state">No quests yet. Add one above to begin your journey.</p>
        )}
      </div>
    </div>
  );
}

export default App;