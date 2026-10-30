# Airline Passenger Satisfaction Prediction Web Application

A full-stack, enterprise-grade machine learning web application powered directly by a pre-trained **WEKA Random Forest** model (`projectmodel_weka.model`).

---

## 1. Project Overview

This application predicts airline passenger satisfaction (`Satisfied` vs. `Neutral or Dissatisfied`) based on flight demographics and flight service ratings. 

Unlike conventional prototypes that simulate predictions or substitute new models, this system loads and executes the **authentic, pre-trained WEKA Random Forest model** in real time using WEKA's Java runtime serialization API (`SerializationHelper.read()`).

### Verified Model Performance (Stratified 10-Fold Cross-Validation)

The model was trained on **129,880 airline passenger instances** using WEKA RandomForest (100 iterations, base learner RandomTree, Seed 1):

| Metric | Cross-Validation Result |
|---|---:|
| **Evaluation Method** | Stratified 10-Fold Cross-Validation |
| **Total Instances** | 129,880 |
| **Correctly Classified** | 125,131 (96.3435%) |
| **Incorrectly Classified** | 4,749 (3.6565%) |
| **Kappa Statistic** | 0.9253 |
| **Mean Absolute Error (MAE)** | 0.0662 |
| **Root Mean Squared Error (RMSE)** | 0.1662 |
| **Weighted Precision** | 0.964 |
| **Weighted Recall** | 0.963 |
| **Weighted F1-Score** | 0.963 |
| **Weighted MCC** | 0.926 |
| **Weighted ROC Area (AUC)** | 0.995 |
| **Weighted PRC Area** | 0.995 |
| **Model Build Time** | 23.16 seconds |

#### Verified Confusion Matrix:

| Actual / Predicted | Neutral or Dissatisfied | Satisfied | Total |
|---|---:|---:|---:|
| **Neutral or Dissatisfied** | 72,049 | 1,403 | 73,452 |
| **Satisfied** | 3,346 | 53,082 | 56,428 |

> **Note:** The 96.3435% accuracy represents historical offline 10-fold cross-validation performance. It is strictly separated from live application prediction statistics.

---

## 2. Architecture & Technology Stack

```
React + TypeScript Frontend (Port 5173)
                 ↓ (HTTP REST)
FastAPI Python Backend (Port 8000)
                 ↓ (HTTP JSON)
Java WEKA Prediction Engine (Port 8081)
                 ↓ (In-Memory Java Instance)
Original Serialized WEKA RandomForest Model (projectmodel_weka.model)
                 ↓ (classifyInstance & distributionForInstance)
Real-time Satisfaction Prediction & Probabilities
                 ↓
SQLite Database (Persistent Prediction History)
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, React Router v6.
- **Backend**: Python 3.14, FastAPI, Pydantic v2, SQLAlchemy, SQLite, Uvicorn, HTTPX.
- **WEKA Integration**: OpenJDK 25 LTS, WEKA 3.8.7 JAR (`SerializationHelper`, `RandomForest`, `DenseInstance`).

---

## 3. Project Directory Structure

```
wekaproject/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components & rating selectors
│   │   ├── pages/            # Dashboard, Predict, History, Performance, About
│   │   ├── layouts/          # AppLayout with sidebar & live engine health pill
│   │   ├── services/         # API client communicating with FastAPI
│   │   ├── types/            # TypeScript schemas & interfaces
│   │   ├── App.tsx           # Router configuration
│   │   └── main.tsx          # React entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── start-frontend.sh     # Frontend launcher script
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint & CORS
│   │   ├── config/           # App settings & environment loader
│   │   ├── database/         # SQLAlchemy SQLite session & models
│   │   ├── routes/           # health, model, predict, history, dashboard
│   │   ├── schemas/          # Pydantic input/output schemas
│   │   └── services/         # weka_client & prediction_service
│   │
│   ├── java-engine/
│   │   ├── src/com/weka/prediction/WekaPredictionServer.java # Java Engine HTTP Server
│   │   ├── lib/weka.jar      # WEKA 3.8.7 JAR
│   │   └── start-engine.sh   # Java server launcher script
│   │
│   ├── model/
│   │   └── projectmodel_weka.model # Pre-trained 67 MB WEKA RandomForest binary
│   │
│   ├── tests/
│   │   └── test_api.py       # Automated integration test suite
│   ├── requirements.txt
│   ├── start-backend.sh      # Backend launcher script
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 4. Prerequisites

- **macOS** (Apple Silicon or Intel)
- **Java**: Java 17+ or Java 25 (Bundled in `/Applications/weka-3.8.7.app/Contents/runtime/Contents/Home/bin/java`)
- **Python**: Python 3.10+ (Tested on Python 3.14.5)
- **Node.js**: Node.js 18+ & npm (Tested on Node v26.5.0, npm 11.17.0)

---

## 5. Quick Start Instructions (macOS)

Open **3 separate Terminal tabs** in `/Users/siddharthsingh/wekaproject`:

### Terminal 1: Start Java WEKA Prediction Engine (Port 8081)

```bash
cd /Users/siddharthsingh/wekaproject/backend/java-engine
./start-engine.sh
```
*Output confirmation: `[Java Weka Server] Server is running on http://127.0.0.1:8081`*

### Terminal 2: Start FastAPI Python Backend (Port 8000)

```bash
cd /Users/siddharthsingh/wekaproject/backend
./start-backend.sh
```
*Output confirmation: `Uvicorn running on http://0.0.0.0:8000`*

### Terminal 3: Start React Frontend (Port 5173)

```bash
cd /Users/siddharthsingh/wekaproject/frontend
./start-frontend.sh
```
*Output confirmation: `Local: http://localhost:5173/`*

Now open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 6. REST API Endpoints

Interactive Swagger UI documentation is available at **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend status, Java engine status, and model load status |
| `GET` | `/api/model/info` | Returns model specifications, schema attributes, and verified 10-fold CV metrics |
| `POST` | `/api/predict` | Computes prediction via WEKA RandomForest and records history in SQLite |
| `GET` | `/api/predictions` | Fetches stored prediction history (supports pagination) |
| `DELETE` | `/api/predictions` | Clears all prediction history with confirmation |
| `DELETE` | `/api/predictions/{id}` | Deletes an individual prediction record |
| `GET` | `/api/dashboard/stats` | Returns real-time aggregate application statistics & recent feed |

---

## 7. Automated Testing

To run the automated integration test suite:

```bash
cd /Users/siddharthsingh/wekaproject/backend
source venv/bin/activate
pytest tests/test_api.py
```

All 7 integration tests verify:
1. Health endpoint response and Java engine connectivity
2. Model info schema and 10-fold CV metrics
3. Live prediction of Satisfied class instance
4. Live prediction of Neutral or Dissatisfied class instance
5. Input range validation and 422 error rejection
6. History persistence in SQLite
7. Dashboard live statistics calculation

---

## 8. Model Limitations & Transparency

1. **Probability Estimates**: Model probabilities represent the proportion of RandomTree estimators in the forest agreeing on a specific class; they are statistical estimates, not guaranteed certainty.
2. **Evaluation Domain**: The historical 96.3435% accuracy represents cross-validation on the passenger dataset; real-world distribution shifts may affect live performance.
3. **Attribute Scale**: Service rating attributes must remain on a standard 0 to 5 scale as expected by the training schema.
