// ============================================================
//  data.js — טוען את השאלות מ-data.md ומספק פונקציית בדיקת שורש
//  אין צורך לערוך קובץ זה. לעריכת שאלות — ערוך את data.md
// ============================================================

// בדיקת שורש גמישה: מתעלמת ממקפים/גרשיים/רווחים,
// ומתייחסת לאותיות סופיות (ך/כ, ם/מ, ן/נ, ף/פ, ץ/צ) כזהות
function normRoot(s) {
  return s.trim()
    .replace(/[-–—\s'"״]/g, "")   // הסר מקפים, גרשיים, רווחים
    .replace(/ך/g, "כ").replace(/ם/g, "מ")
    .replace(/ן/g, "נ").replace(/ף/g, "פ")
    .replace(/ץ/g, "צ");
}

function checkRoot(userInput, correctRoot) {
  return normRoot(userInput) === normRoot(correctRoot);
}

// פענוח שורת טבלה ב-Markdown: | תא | תא | ... |
function parseMdTableRow(line) {
  return line
    .split("|")
    .slice(1, -1)                  // הסר את ה-| הראשון והאחרון
    .map(cell => cell.trim());
}

function isSeparatorRow(line) {
  return /^\s*\|[\s|:-]+\|\s*$/.test(line);
}

async function loadQuestions() {
  const res  = await fetch("data.md");
  const text = await res.text();

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // מצא את שורת הכותרת של הטבלה
  const headerIdx = lines.findIndex(l => l.startsWith("|") && l.includes("משפט"));
  if (headerIdx === -1) throw new Error("לא נמצאה טבלת שאלות ב-data.md");

  const questions = [];
  for (let i = headerIdx + 2; i < lines.length; i++) {  // +2 לדלג על שורת ה---
    const line = lines[i];
    if (!line.startsWith("|")) break;               // סוף הטבלה
    if (isSeparatorRow(line)) continue;

    const [sentence, verb, root, guf, zman, binyan] = parseMdTableRow(line);
    if (sentence && verb && root && guf && zman && binyan) {
      questions.push({ sentence, verb, root, guf, zman, binyan });
    }
  }

  if (questions.length === 0) throw new Error("לא נמצאו שאלות בטבלה");
  return questions;
}
