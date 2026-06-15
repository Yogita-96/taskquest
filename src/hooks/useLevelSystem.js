import { useState, useEffect } from "react";
 
const TITLES = [
  "Newcomer",
  "Apprentice",
  "Scout",
  "Adventurer",
  "Warrior",
  "Champion",
  "Legend",
];
 
// XP needed to complete level N = N * 100
// Level 1 → 100 XP, Level 2 → 200 XP, Level 3 → 300 XP ...
function getLevelFromTotalXP(totalXP) {
  let level = 1;
  let xpAccumulated = 0;
 
  while (true) {
    const xpForThisLevel = level * 100;
    if (totalXP < xpAccumulated + xpForThisLevel) break;
    xpAccumulated += xpForThisLevel;
    level++;
  }
 
  const xpForCurrentLevel = level * 100;
  const xpIntoCurrentLevel = totalXP - xpAccumulated;
 
  return {
    level,
    xpIntoCurrentLevel,
    xpForCurrentLevel,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    progressPercent: Math.floor((xpIntoCurrentLevel / xpForCurrentLevel) * 100),
  };
}
 
export function useLevelSystem() {
  const [totalXP, setTotalXP] = useState(() => {
    return Number(localStorage.getItem("xp")) || 0;
  });
 
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newTitle, setNewTitle] = useState("");
 
  const levelInfo = getLevelFromTotalXP(totalXP);
  const prevLevelInfo = getLevelFromTotalXP(Math.max(0, totalXP - 10));
 
  useEffect(() => {
    localStorage.setItem("xp", totalXP);
  }, [totalXP]);
 
  const addXP = (amount) => {
    setTotalXP((prev) => {
      const next = prev + amount;
      const before = getLevelFromTotalXP(prev);
      const after = getLevelFromTotalXP(next);
 
      if (after.level > before.level) {
        setNewTitle(after.title);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2500);
      }
 
      return next;
    });
  };
 
  const dismissLevelUp = () => setShowLevelUp(false);
 
  return {
    totalXP,
    levelInfo,
    showLevelUp,
    newTitle,
    addXP,
    dismissLevelUp,
  };
}
