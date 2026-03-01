let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {

    loadReports();

    // Proper MV3 event binding (no inline HTML handlers)
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", clearReports);
    }
});

// ===============================
// Load Reports
// ===============================
function loadReports() {

    chrome.storage.local.get(["reports"], (result) => {

        const reports = result?.reports || [];

        let threat = 0;
        let toxicity = 0;
        let insult = 0;
        let hate = 0;

        reports.forEach(r => {

            const rawCategory =
                r.finalCategory ||
                r.category ||
                "";

            const cat = rawCategory.toLowerCase();

            if (cat.includes("threat") || cat.includes("violent")) {
                threat++;
            }
            else if (cat.includes("toxic")) {
                toxicity++;
            }
            else if (cat.includes("harass") || cat.includes("insult")) {
                insult++;
            }
            else if (cat.includes("hate")) {
                hate++;
            }
        });

        updateText("totalCount", reports.length);
        updateText("threatCount", threat);
        updateText("toxicityCount", toxicity);
        updateText("insultCount", insult);
        updateText("hateCount", hate);

        renderChart(threat, toxicity, insult, hate);
        renderReports(reports);
    });
}

// ===============================
// Safe Text Update
// ===============================
function updateText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

// ===============================
// Render Donut Chart
// ===============================
function renderChart(threat, toxicity, insult, hate) {

    const canvas = document.getElementById("reportChart");
    if (!canvas || typeof Chart === "undefined") return;

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: [
                "Threat",
                "Toxicity",
                "Insult / Harassment",
                "Identity Hate"
            ],
            datasets: [{
                data: [threat, toxicity, insult, hate],
                backgroundColor: [
                    "#3b82f6",
                    "#ec4899",
                    "#f97316",
                    "#facc15"
                ],
                hoverOffset: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#ffffff",
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

// ===============================
// Render Report Cards
// ===============================
function renderReports(reports) {

    const container = document.getElementById("reports");
    if (!container) return;

    container.innerHTML = "";

    if (reports.length === 0) {
        container.innerHTML = "<p>No reports yet.</p>";
        return;
    }

    reports.slice().reverse().forEach(r => {

        const category =
            r.finalCategory ||
            r.category ||
            "Unknown";

        const confidence =
            typeof r.confidence === "number"
                ? (r.confidence * 100).toFixed(1)
                : r.confidence || "0";

        const trust =
            r.trustScore ||
            r.trust_score ||
            "N/A";

        const text =
            r.text ||
            r.content ||
            "";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <b style="color:#f87171">${category}</b><br>
            Confidence: ${confidence}%<br>
            Trust Score: ${trust}<br>
            <small>${text}</small>
        `;

        container.appendChild(card);
    });
}

// ===============================
// Clear Reports
// ===============================
function clearReports() {
    chrome.storage.local.set({ reports: [] }, () => {
        loadReports();
    });
}