from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)

MODEL = "unitary/toxic-bert"

tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

labels = ["toxicity", "severe_toxicity", "obscene", "threat", "insult", "identity_hate"]

def map_category(scores):
    if scores["threat"] > 0.6:
        return "Threat / Violent Intent"
    if scores["identity_hate"] > 0.6:
        return "Hate Speech"
    if scores["insult"] > 0.6 or scores["severe_toxicity"] > 0.6:
        return "Harassment"
    if scores["toxicity"] > 0.5:
        return "Mild Toxicity"
    return "Safe"

def calculate_trust(scores):
    risk = (
        scores["threat"] * 4 +
        scores["identity_hate"] * 3 +
        scores["insult"] * 2 +
        scores["toxicity"]
    )
    return max(0, 100 - int(risk * 100))

@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.json["text"]

    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    outputs = model(**inputs)
    probs = torch.sigmoid(outputs.logits)[0]

    scores = {labels[i]: float(probs[i]) for i in range(len(labels))}

    category = map_category(scores)
    trust = calculate_trust(scores)

    return jsonify({
        "severity": scores,
        "finalCategory": category,
        "confidence": max(scores.values()),
        "trustScore": trust
    })

if __name__ == "__main__":
    app.run(port=5000)