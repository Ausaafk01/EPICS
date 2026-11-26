# Gram Vikas — Rural Governance & Civic Intelligence Platform

Gram Vikas is an open-source civic intelligence and rural governance platform built for Gram Panchayats. It provides transparent grievance redressal, public works and expenditure tracking, rural infrastructure asset monitoring, government scheme eligibility evaluation, and assisted digital access for village residents.

---

## Features & Modules

- **Dynamic Onboarding & Auth (`/api/v1/auth`)**: Self-service registration for new Panchayats (creates village root and Sarpanch account) and resident citizens with secure password hashing (`scrypt`) and role-based JWTs.
- **Grievance Redressal (`/api/v1/grievances`)**: Category-based grievance submission, SLA tracking, status transition workflows, resolution verification, and citizen closure ratings.
- **Infrastructure & Asset Monitoring (`/api/v1/infrastructure`)**: Inventory of borewells, overhead tanks, transformers, and public amenities with GPS coordinates and fault logging. Auto-spawns high-priority repair grievances when assets fail.
- **Development & Expenditure Tracking (`/api/v1/projects`)**: Civil works monitoring, milestone-based progress, funding source tracking (15th FC, MGNREGS, SBM), and dual-signatory expenditure vouchers (Sachiv + Sarpanch).
- **Civic Verification & Social Audit (`/api/v1/verification`)**: Geo-tagged photo inspection reports. Automatically flags financial-vs-physical audit variances (e.g. funds disbursed >75% while work is incomplete).
- **Scheme Intelligence (`/api/v1/schemes`)**: Welfare scheme catalog (PMAY-G, PM-KISAN, Jal Jeevan Mission) with a deterministic, rule-based eligibility evaluator and application pipeline.
- **Assisted Digital Access (`/api/v1/assisted`)**: VLE/operator proxy submissions with legal consent tracking and short offline paper receipt tokens (`VLE-XXXXX`) for residents without smartphones.

---

## Tech Stack

- **Runtime**: Node.js (v20+) + Express
- **Language**: TypeScript (strict mode, path aliases)
- **Database**: PostgreSQL 15+ (modular relational schema, multi-tenant partitioning by Panchayat)
- **Validation**: Zod (strict request payload schemas)
- **Testing**: Vitest + Supertest (unit and integration suites)
- **Security**: Helmet, CORS, parameterized queries, tenant context isolation

---

## Project Structure

```
EPICS/
├── README.md
├── docs/
│   ├── domain/               # Domain specifications and RBAC matrix
│   └── architecture/         # System architecture, API specs, schemas & seeds
│       ├── schema/           # Modular SQL DDL (01_core.sql - 06_schemes_and_assisted.sql)
│       └── seeds/            # Master reference seeds (jurisdiction, schemes)
└── backend/
    ├── scripts/              # Migration and seed runner scripts
    ├── src/
    │   ├── core/             # Database connection, middleware, events, error handling
    │   └── modules/          # Domain modules (auth, grievance, infrastructure, etc.)
    └── tests/
        ├── unit/             # Error handling and event bus tests
        └── integration/      # End-to-end API and multi-tenant integration tests
```

---

## Getting Started

### 1. Prerequisites
- Node.js 20 or higher
- PostgreSQL 15+

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Configure your PostgreSQL credentials in `backend/.env`.

### 3. Database Migration & Seeds
```bash
npm run migrate
npm run seed
```

### 4. Run Tests
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```

For production builds:
```bash
npm run build
npm start
```

---

## License
MIT
