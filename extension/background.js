let userData = {};

function calculateSeverity(text) {
  const lower = text.toLowerCase();

  let score = 0;

  if (lower.includes("kill") || lower.includes("die")) score += 0.8;
  if (lower.includes("hate")) score += 0.6;
  if (lower.includes("stupid") || lower.includes("idiot")) score += 0.5;
  if (lower.includes("fuck") || lower.includes("bitch")) score += 0.7;

  return Math.min(score, 1);
}

function getCategory(score) {
  if (score < 0.3) return "Safe";
  if (score < 0.5) return "Mild Toxicity";
  if (score < 0.7) return "Harassment";
  if (score < 0.85) return "Hate Speech";
  return "Threat / Violent Intent";
}

function updateTrust(user, severity) {

  if (!userData[user]) {
    userData[user] = {
      trust: 100,
      violations: 0
    };
  }

  if (severity > 0.5) {
    userData[user].violations += 1;
    userData[user].trust -= severity * 20;
  }

  userData[user].trust = Math.max(0, userData[user].trust);

  return userData[user].trust;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type === "ANALYZE_TEXT") {

    const severity = calculateSeverity(request.text);
    const category = getCategory(severity);
    const trust = updateTrust(request.user_id, severity);

    let decision = "ALLOW";
    if (severity > 0.8 && trust < 40) decision = "AUTO_BLOCK";
    else if (severity > 0.5) decision = "REVIEW_REQUIRED";

    const report = {
      content: request.text,
      category,
      confidence: severity.toFixed(2),
      trust_score: trust.toFixed(2),
      decision,
      timestamp: new Date().toISOString()
    };

    if (category !== "Safe") {
      chrome.storage.local.get(["reports"], (data) => {
        const reports = data.reports || [];
        reports.push(report);
        chrome.storage.local.set({ reports });
      });
    }

    sendResponse(report);
  }

  return true;
});