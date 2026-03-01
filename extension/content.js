// ================================
// AI Abuse Analyzer - Content Script
// ================================

console.log("AI Abuse Analyzer content script loaded");

let scannedElements = new WeakSet();

// -------------------------------
// Create Dashboard Button
// -------------------------------
function createDashboardButton() {
    const btn = document.createElement("button");
    btn.innerText = "AI Dashboard";

    Object.assign(btn.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "10px 15px",
        background: "#111",
        color: "white",
        border: "none",
        borderRadius: "8px",
        zIndex: "999999",
        cursor: "pointer",
        fontWeight: "bold"
    });

    // Open dashboard in separate tab
    btn.onclick = () => {
        const url = chrome.runtime.getURL("dashboard.html");
        window.open(url, "_blank");
    };

    document.body.appendChild(btn);
}

// -------------------------------
// Highlight Toxic Content
// -------------------------------
function highlightElement(element, data) {
    element.style.background = "rgba(239,68,68,0.15)";
    element.style.borderRadius = "6px";
    element.style.padding = "4px";

    const badge = document.createElement("span");
    badge.innerText = `${data.finalCategory} | ${(data.confidence * 100).toFixed(1)}%`;

    Object.assign(badge.style, {
        background: "#ef4444",
        color: "white",
        padding: "2px 6px",
        borderRadius: "12px",
        fontSize: "10px",
        marginLeft: "6px"
    });

    element.appendChild(badge);
}

// -------------------------------
// Store Report in Chrome Storage
// -------------------------------
function storeReport(text, data) {
    chrome.storage.local.get(["reports"], (result) => {
        const existing = result.reports || [];

        existing.push({
            finalCategory: data.finalCategory,
            confidence: data.confidence,
            trustScore: data.trustScore,
            text: text,
            timestamp: new Date().toISOString()
        });

        chrome.storage.local.set({ reports: existing });
    });
}

// -------------------------------
// Call Backend AI Server
// -------------------------------
async function analyzeText(text, element) {
    try {
        const response = await fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.finalCategory && data.finalCategory !== "Safe") {
            highlightElement(element, data);
            storeReport(text, data);
        }

    } catch (error) {
        console.log("AI server not reachable");
    }
}

// -------------------------------
// Scan Page Content
// -------------------------------
function scanScreen(root = document.body) {
    const elements = root.querySelectorAll("span, p, h1, h2, h3");

    elements.forEach(el => {
        if (scannedElements.has(el)) return;

        const text = el.innerText?.trim();
        if (!text || text.length < 15) return;

        scannedElements.add(el);
        analyzeText(text, el);
    });
}

// -------------------------------
// Observe Dynamic Instagram Content
// -------------------------------
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                scanScreen(node);
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// -------------------------------
// Initialize
// -------------------------------
createDashboardButton();
scanScreen();