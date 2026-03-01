# 🔍 AI Abuse Analyzer

An AI-powered Chrome extension that detects toxic and harmful content on Instagram in real time using a BERT-based NLP model and visualizes moderation analytics through an interactive dashboard.

---

## 🚀 Overview

AI Abuse Analyzer is a real-time content moderation system designed to identify abusive, toxic, and policy-violating language on social media platforms.  

The system integrates a Chrome Extension (Manifest v3) with a Flask-based backend powered by a transformer model to analyze user-generated content dynamically.

Detected violations are stored locally and displayed in a sleek analytics dashboard with visual insights.

---

## 🎯 Key Features

- 🔎 Real-time scanning of Instagram posts and comments  
- 🤖 AI-based toxicity classification using BERT  
- 📊 Interactive dashboard with donut chart analytics  
- 📈 Category-wise breakdown (Threat, Toxicity, Harassment, Hate Speech)  
- 🧠 Confidence scoring for predictions  
- 👤 Trust score tracking system  
- 💾 Local storage-based report management  
- 🧹 Clear reports functionality  
- ⚡ Chrome Extension (Manifest v3 compliant)

---

## 🧠 System Architecture

1. **Content Script**
   - Monitors visible DOM elements using MutationObserver
   - Extracts meaningful text content
   - Sends text to backend API

2. **Backend (Flask + Transformers)**
   - Loads a pre-trained BERT toxicity model
   - Processes input text
   - Returns classification, confidence score, and category

3. **Dashboard**
   - Reads stored reports
   - Displays statistics
   - Renders donut chart using Chart.js
   - Shows individual moderation entries

---

## 🛠 Tech Stack

| Layer            | Technology Used |
|------------------|----------------|
| Backend          | Python (Flask) |
| NLP Model        | HuggingFace Transformers (BERT) |
| Frontend         | JavaScript |
| Extension        | Chrome Extension (Manifest v3) |
| Visualization    | Chart.js |
| Storage          | Chrome Storage API |

---

## 📊 Dashboard Preview

- Total reports counter
- Category distribution chart
- Individual violation cards
- Modern dark UI
- Smooth hover effects

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/AI-Abuse-Analyzer.git
cd AI-Abuse-Analyzer
 2️⃣ Install Backend Dependencies
pip install flask transformers torch
3️⃣ Run Backend Server
python ai_server.py

Server will run at:

http://127.0.0.1:5000
 4️⃣ Load Chrome Extension

Open Chrome

Go to chrome://extensions

Enable Developer Mode

Click Load Unpacked

Select the extension/ folder

🧪 How It Works in Action

Open Instagram

The extension scans visible comments/posts

Toxic content is analyzed via backend

Reports are stored locally

Open dashboard to view analytics

🔐 Ethical Considerations

This project is developed for research and educational purposes.
It demonstrates how AI can assist in online moderation but does not replace human judgment.

📈 Future Enhancements

Sentiment trend tracking over time

User risk profiling system

Multi-platform support (Twitter, Facebook, YouTube)

AI explanation summaries

Real-time blocking mechanisms

---

