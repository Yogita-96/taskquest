import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");

  const [quests, setQuests] = useState(() => {
    const savedQuests = localStorage.getItem("quests");
    return savedQuests ? JSON.parse(savedQuests) : [];
  });

  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem("xp")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("quests", JSON.stringify(quests));
    localStorage.setItem("xp", xp);
  }, [quests, xp]);

  const addQuest = () => {
    if (!task.trim()) {
      alert("Quest title cannot be empty!");
      return;
    }

    const duplicateQuest = quests.find(
      (q) => q.text.toLowerCase() === task.toLowerCase()
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
        quest.id === id
          ? { ...quest, completed: true }
          : quest
      )
    );

    setXp(xp + 10);
  };

  const deleteQuest = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to abandon this quest?"
    );

    if (confirmDelete) {
      setQuests(quests.filter((quest) => quest.id !== id));
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🎮 TaskQuest</h1>

        <p className="subtitle">
          Gamified productivity powered by QA thinking.
        </p>

        <div className="xp-box">
          <div className="xp-text">
            <span>XP Progress</span>
            <span>{xp} XP</span>
          </div>

          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{
                width: `${Math.min(xp, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="task-input">
          <input
            type="text"
            placeholder="Enter a new quest..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addQuest}>
            Add
          </button>
        </div>

        <div className="quest-list">
          {quests.map((quest) => (
            <div className="quest-card" key={quest.id}>
              <span
                className={
                  quest.completed ? "completed" : ""
                }
              >
                {quest.text}
              </span>

              <div className="buttons">
                {!quest.completed && (
                  <button
                    className="complete-btn"
                    onClick={() =>
                      completeQuest(quest.id)
                    }
                  >
                    Complete
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteQuest(quest.id)
                  }
                >
                  Delete
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