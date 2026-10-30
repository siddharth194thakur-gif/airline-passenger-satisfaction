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

## 2. Production Deployment Architecture

```
User Browser
     │
     ▼
Vercel (React 18 + Vite TypeScript SPA)
     │
     ▼  HTTPS (VITE_API_BASE_URL)
Render Docker Web Service ($PORT)
  ┌────────────────────────────────────────────────────────┐
  │  FastAPI (Python 3.12, Uvicorn)                        │
  │     │                                                  │
  │     ▼  Internal HTTP (127.0.0.1:8081)                  │
  │  Java WEKA Engine (OpenJDK 21, weka.jar)               │
  │     │                                                  │
  │     ▼  In-Memory Serialization                         │
  │  WEKA RandomForest Model (projectmodel_weka.model)     │
  └────────────────────────────────────────────────────────┘
     │
     ▼  SQLAlchemy (DATABASE_URL)
Render Managed PostgreSQL Database
```

---

## 3. Render Deployment (Backend + Java Engine)

Render runs both the Java WEKA prediction engine and the FastAPI backend within a single managed Docker Web Service container.

### Step 1: Create a PostgreSQL Database on Render
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **PostgreSQL**.
3. Name it (e.g., `airline-satisfaction-db`).
4. Select the Free or Starter plan.
5. Click **Create Database**.
6. Once provisioned, copy the **Internal Database URL** (e.g., `postgres://user:password@host/dbname`).

### Step 2: Create the Docker Web Service on Render
1. Push your repository to GitHub (see [Git Instructions](#5-git-commands-to-push-to-github)).
2. In the Render Dashboard, click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `airline-satisfaction-backend`
   - **Language**: `Docker`
   - **Branch**: `main`
   - **Root Directory**: `.` (leave as root)
   - **Dockerfile Path**: `./Dockerfile` (or `./backend/Dockerfile`)
   - **Instance Type**: `Free` or `Starter` (Starter 1GB recommended for production)
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: Paste the Internal Database URL from Step 1.
   - `CORS_ORIGINS`: `["https://your-frontend.vercel.app", "http://localhost:5173"]` (or `*`)
   - `JAVA_OPTS`: `-Xms128m -Xmx600m`
6. Click **Create Web Service**.
7. Render will build the Docker container, launch the Java prediction engine, wait for the model to load into memory, and expose FastAPI.
8. Once deployed, note your service URL (e.g., `https://airline-satisfaction-backend.onrender.com`).

---

## 4. Vercel Deployment (Frontend React SPA)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://airline-satisfaction-backend.onrender.com/api` (replace with your Render backend URL)
6. Click **Deploy**.
7. Once deployed, Vercel gives you your production URL (e.g., `https://airline-satisfaction.vercel.app`).
8. Back in Render, add your Vercel URL to `CORS_ORIGINS` if you restricted CORS.

---

## 5. Git Commands to Push to GitHub

```bash
cd /Users/siddharthsingh/wekaproject

# 1. Create a new repository on github.com (e.g. airline-satisfaction-app)

# 2. Add your remote
git remote add origin https://github.com/<YOUR_USERNAME>/airline-satisfaction-app.git

# 3. Ensure branch is main
git branch -M main

# 4. Push code and model to GitHub
git push -u origin main
```

> **Note on Model Size**: The model file `backend/model/projectmodel_weka.model` is **70.4 MB**. GitHub permits files up to 100 MB directly via standard `git push`.

---

## 6. Local Development (macOS)

Open 3 separate Terminal tabs in `/Users/siddharthsingh/wekaproject`:

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

### Terminal 3: Vite React Frontend (Port 5173)
```bash
cd /Users/siddharthsingh/wekaproject/frontend
./start-frontend.sh
```

Open browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 7. Automated Testing

To run the integration tests locally:

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
- SQLite/PostgreSQL history logging and retrieval
- Real-time dashboard statistics calculation

---

## 8. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **Render: Out Of Memory (OOM)** | Java default memory exceeded container RAM. | Set environment variable `JAVA_OPTS=-Xms128m -Xmx512m` in Render dashboard. |
| **Vercel: 404 on refresh** | Direct navigation without SPA rewrites. | Verified `frontend/vercel.json` rewrite `{ "source": "/(.*)", "destination": "/index.html" }` is included. |
| **Frontend: CORS Network Error** | Backend did not allow frontend origin. | Ensure `CORS_ORIGINS` in Render includes your Vercel URL or `*`. |
| **Backend: Database connection error** | Render provides `postgres://` which SQLAlchemy 2.0 rejects. | `settings.py` automatically converts `postgres://` to `postgresql://`. Ensure `psycopg2-binary` is installed. |
