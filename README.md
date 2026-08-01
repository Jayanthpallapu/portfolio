# Jayanth Pallapu — Applied AI Engineer & Data Science Manager Portfolio

A high-performance, interactive portfolio website for **Jayanth Pallapu**, Applied AI Engineer & Data Science Manager. Built with **Next.js 16 (Turbopack)**, **React 19**, **TailwindCSS**, **Framer Motion**, and **Spline 3D**, featuring real-time Telegram contact notifications, canvas background shaders, and optimized static delivery via **Caddy**.

---

## 🚀 Key Features & Architectural Highlights

- **🎯 PDF Resume Content Synchronization**: 100% aligned with official resume data, including profile summary, 5 professional experience roles, 4 featured projects, and education credentials.
- **🎨 Dynamic Visuals & Canvas Backgrounds**:
  - Custom WebGL lightning shader & ambient spotlight with an interactive hue slider.
  - Section-specific animated canvas backgrounds (Constellation, Data Stream, Circuit Board, Neural Network, Aurora).
  - 3D Interactive Robot model via `@splinetool/react-spline`.
- **📩 Real-Time Contact API**:
  - Next.js API route (`/api/contact`) integrated with Telegram Bot API (`sendMessage`) for instant mobile notifications.
  - Input validation, email regex verification, character limit checks, and HTML entity escaping for XSS security.
- **⚡ Production & Caching Optimizations**:
  - **Standalone Build Output**: Configured for lightweight containerized/server deployments (`output: "standalone"`).
  - **Caddy Gateway**: Reverse proxy configured with `gzip` and `zstd` compression, server header stripping, and `31536000s` (1 year) immutable caching for static assets.
  - **Security Headers**: Injected `Strict-Transport-Security`, `X-Frame-Options` (DENY), `X-Content-Type-Options` (nosniff), `Referrer-Policy`, and `Permissions-Policy`.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Motion** | TailwindCSS v4, Framer Motion, Lucide Icons |
| **3D & Canvas** | `@splinetool/react-spline`, Custom Canvas WebGL Shaders |
| **API & Backend** | Next.js Route Handlers, Telegram Bot API |
| **Reverse Proxy & CDN** | Caddy v2 (Gzip + Zstd, Immutable Cache Control) |
| **Runtime & Tooling** | Node.js, Bun, Turbopack, ESLint |

---

## 💼 Featured Projects Covered

1. **Nvidia DriveSync**
   - Architected a multi-modal data curation & hybrid vector retrieval pipeline for NVIDIA technical documentation using Qdrant, PyMuPDF, and Scrapy.
   - Dense & BM25 sparse search with Reciprocal Rank Fusion (RRF) deduplication.
2. **XAU/BTC Realtime Analysis**
   - Enterprise multi-agent AI platform utilizing CrewAI, Groq (Llama 3.3), FastAPI, and Next.js across 6 specialized autonomous agents.
   - Integrated Model Context Protocol (MCP) with 25 tools, WebSocket telemetry, Supabase, and Telegram alerts.
3. **Customer-churn-prediction-ML-pipeline**
   - End-to-end Customer Churn Prediction system in Python using EDA, cohort analysis, and feature engineering.
   - Automated MLOps pipeline with Apache Airflow for ETL & retraining, alongside a Streamlit dashboard.
4. **House Price Prediction Model**
   - End-to-end predictive modeling pipeline in Python for residential property valuation with EDA, outlier handling, imputation, One-Hot encoding, and scaling.

---

## ⚙️ Building & Running Locally

### 1. Prerequisites
- Node.js `^18.17.0` or `^20.0.0` (or `bun`)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/Jayanthpallapu/portfolio.git
cd portfolio
```

### 3. Install Dependencies
```bash
npm install
# or
bun install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_telegram_chat_id"
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Deployment & Standalone Build

### 1. Build the Production Bundle
```bash
npm run build
```
This compiles the application, runs static page generation, and prepares standalone output files in `.next/standalone`.

### 2. Run Standalone Production Server
```bash
npm start
```

### 3. Caddy Reverse Proxy Configuration
Ensure your Caddy server runs with the included `Caddyfile` for compression and header optimization:
```bash
caddy run --config Caddyfile
```

---

## 📬 Contact & Links

- **Portfolio**: [portfolio-blush-five-kaaocyfztr.vercel.app](https://portfolio-blush-five-kaaocyfztr.vercel.app)
- **GitHub**: [github.com/Jayanthpallapu](https://github.com/Jayanthpallapu)
- **LinkedIn**: [linkedin.com/in/jayanth-pallapu](https://linkedin.com/in/jayanth-pallapu)
- **Email**: [jayanth.pallapu@outlook.com](mailto:jayanth.pallapu@outlook.com)
- **Location**: Bangalore, India
