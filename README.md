# 🏆 AICTE Document Verification Portal (DOC-VERIFY)

**Smart India Hackathon 2024 Finalist Project**

A modern, production-ready React + Vite application for AICTE (All India Council for Technical Education) document verification, institutional approval scrutiny, infrastructure validation, and APAAR student registry integration.

---

## 🎯 Architecture & Overview

This project has been rewritten as a unified, full-fidelity React SPA running on Vite (Port 3000):

- **Institute Portal (`/institute`)**:
  - Application dashboard with live metrics (total, in review, approved)
  - New application initiator (New Institutions, Extension of Approval, Collaboration, ODL/OL)
  - Document upload portal with AI scrutiny against AICTE Approval Process Handbook (APH)
  - Interactive Error Analysis Dashboard with bounding-box discrepancy markers, legal rectification editor, and PDF export
  - Infrastructure verification with EXIF geo-coordinate matching and blueprint inspection
  - Built-in AICTE Handbook expert assistant chatbot
- **Evaluator / Scrutiny Portal (`/evaluator`)**:
  - Scrutiny Committee dashboard with live review queue
  - Multi-stage document review (Authenticity, Handbook Norms Compliance)
  - Document approval / rejection workflow with detailed reason codes and audit remarks
  - Historical evaluation analytics and compliance statistics
- **AICTE Admin Portal (`/admin`)**:
  - Evaluators live activity table and monitoring
  - Institutional application distribution graphs
  - Banned institutions registry and vigilance tracking
- **APAAR Portal (`/apaar`)**:
  - Automated Permanent Academic Account Registry landing page
  - Student credentials verification and credit tracking dashboard (`/apaar-dash`)

---

## 🚀 Running the Application

### Development
```bash
npm install
npm run dev
```
The dev server starts on `http://0.0.0.0:3000`.

### Production Build
```bash
npm run build
```

---

## 🔑 Demo Access & Test Accounts

- **Institute Portal**:
  - Click **"Fill Demo Credentials"** on `/institute/login` (or use `registrar@futurebright.edu.in` / OTP: `123456` / Password: `Aicte@2024`).
- **Evaluator Portal**:
  - Click **"Fill Demo Credentials"** on `/evaluator` (Dr. Vipul Sharma: `vipul.sharma@aicte-india.org` / Password: `Evaluator@123`).
- **APAAR Portal**:
  - Access `/apaar`, click Login with APAAR ID: `123456789`, Password: `12345`.
