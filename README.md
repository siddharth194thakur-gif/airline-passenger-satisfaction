# Airline Passenger Satisfaction Prediction Web Application

A full-stack, enterprise-grade machine learning web application powered directly by a pre-trained **WEKA Random Forest** model (`projectmodel_weka.model`).

---

## 1. Live Public Website

- **Public Web Application**: **[https://words-populations-connecticut-diana.trycloudflare.com](https://words-populations-connecticut-diana.trycloudflare.com)**
- **GitHub Repository**: **[https://github.com/siddharth194thakur-gif/airline-passenger-satisfaction](https://github.com/siddharth194thakur-gif/airline-passenger-satisfaction)**
- **API Health Check**: `https://words-populations-connecticut-diana.trycloudflare.com/api/health`
- **Swagger API Docs (Local)**: `http://127.0.0.1:8000/docs`

---

## 2. Project Overview

This application predicts airline passenger satisfaction (`Satisfied` vs. `Neutral or Dissatisfied`) based on passenger demographics, flight operational parameters, and pre-flight/in-flight service ratings.

Unlike conventional prototypes that simulate predictions or substitute new models, this system loads and executes the **authentic, pre-trained WEKA Random Forest model** in real time using WEKA's Java runtime serialization API (`SerializationHelper.read()`).

### 100% Free & Zero-Cost Architecture
- **Database**: Defaulted to local **SQLite** (`predictions.db`), requiring **₹0 / $0** paid database provisioning.
- **Backend & Java Engine**: Runs in a containerized environment hosting both FastAPI and the Java WEKA Engine.
- **Frontend**: Fully responsive React 18 + Vite SPA styled with Tailwind CSS.

---

## 3. Verified Model Performance (Stratified 10-Fold Cross-Validation)

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

### Verified Confusion Matrix:

| Actual / Predicted | Neutral or Dissatisfied | Satisfied | Total |
|---|---:|---:|---:|
| **Neutral or Dissatisfied** | 72,049 | 1,403 | 73,452 |
| **Satisfied** | 3,346 | 53,082 | 56,428 |

> **Note:** The 96.3435% accuracy represents historical offline 10-fold cross-validation performance. It is strictly separated from live application prediction statistics.

---

## 4. End-to-End Architecture

```
User (Mobile / Tablet / Desktop)
                 │
                 ▼
React 18 + TypeScript + Tailwind CSS Frontend
                 │
                 ▼  (HTTP REST)
FastAPI Python Backend (Port 8000)
                 │
                 ▼  (Internal HTTP 127.0.0.1:8081)
Java WEKA Prediction Engine (OpenJDK, weka.jar)
                 │
                 ▼  (In-Memory Java Instance)
Original Serialized RandomForest Model (projectmodel_weka.model)
                 │
                 ▼  (classifyInstance & distributionForInstance)
Real-time Satisfaction Prediction & Probabilities
                 │
                 ▼
SQLite Database (Persistent Prediction History — ₹0 Cost)
```

---

## 5. Responsive UI Features

The interface is engineered to adapt smoothly to all screen sizes (phones from 320px width, tablets, laptops, and ultra-wide desktops):

- **Adaptive Layout**: Desktop sidebar navigation with persistent engine status pill; mobile slide-out navigation drawer with backdrop click-to-close.
- **Touch-Friendly Rating Selectors**: Rating grids (0–5) formatted into auto-scaling 6-column grids with active feedback on all mobile widths.
- **Scrollable Data Tables**: Prediction history and confusion matrix tables include touch-scrolling wrappers (`-webkit-overflow-scrolling: touch`) and formatted badges.
- **Responsive Dashboard Cards**: Stacks dynamically from 1 column on mobile to 2 on tablets and 4 on desktop screens.
- **Dark Mode Support**: One-click toggle between crisp enterprise light mode and dark mode with persistent user preference.

---

## 6. Directory Structure

```
wekaproject/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Rating components & cards
│   │   ├── pages/            # Dashboard, Predict, History, Performance, About
│   │   ├── layouts/          # Responsive AppLayout with mobile navigation drawer
│   │   ├── services/         # API client communicating with backend
│   │   ├── types/            # TypeScript schemas & interfaces
│   │   ├── App.tsx           # Router configuration
│   │   └── main.tsx          # React entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── vercel.json           # SPA rewrites for direct navigation & refresh
│   └── start-frontend.sh     # Frontend launcher script
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint & CORS
│   │   ├── config/           # App settings & SQLite / PostgreSQL fallback
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
│   │   └── projectmodel_weka.model # Pre-trained 70.4 MB WEKA RandomForest binary
│   │
│   ├── tests/
│   │   └── test_api.py       # Automated integration test suite (7/7 passing)
│   ├── requirements.txt
│   ├── entrypoint.sh         # Production container supervisor script
│   └── Dockerfile            # Container definition for cloud deployments
│
├── .gitignore
├── Dockerfile                # Root container definition for Render
└── README.md
```

---

## 7. Local Run Commands (macOS)

To run the full stack locally:

### Terminal 1: Java WEKA Prediction Engine (Port 8081)
```bash
cd /Users/siddharthsingh/wekaproject/backend/java-engine
./start-engine.sh
```

### Terminal 2: FastAPI Backend (Port 8000)
```bash
cd /Users/siddharthsingh/wekaproject/backend
./start-backend.sh
```

### Terminal 3: React Frontend (Port 5173)
```bash
cd /Users/siddharthsingh/wekaproject/frontend
./start-frontend.sh
```

Open browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 8. Automated Testing

To run the integration tests:

```bash
cd /Users/siddharthsingh/wekaproject/backend
source venv/bin/activate
pytest tests/test_api.py
```

All 7 integration tests verify:
- Backend `/health` connectivity to Java engine
- Model info and 10-fold CV metrics
- Real-time classification for Satisfied and Dissatisfied profiles
- Pydantic range validation rejection (422)
- SQLite history logging and retrieval
- Real-time dashboard statistics calculation

---

## 9. Cloud Deployment (Render + Vercel)

### Backend on Render (Free Tier):
1. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** $\rightarrow$ **Web Service**.
2. Select repository: `siddharth194thakur-gif/airline-passenger-satisfaction`.
3. Choose **Docker** environment and **Free** plan.
4. Render builds the container using `Dockerfile` and gives your backend URL.

### Frontend on Vercel (Free Tier):
1. Go to [vercel.com](https://vercel.com) and click **Add New...** $\rightarrow$ **Project**.
2. Import `siddharth194thakur-gif/airline-passenger-satisfaction`.
3. Set **Root Directory** to `frontend`.
4. Add environment variable `VITE_API_BASE_URL` with your Render backend URL.
5. Click **Deploy**.
