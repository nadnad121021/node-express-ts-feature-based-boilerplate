# 🚀 Node.js + Express + PostgreSQL + TypeScript Boilerplate

A scalable backend boilerplate built with:

- **Node.js (ESM)**
- **Express.js**
- **PostgreSQL (TypeORM)**
- **TypeScript**
- **pnpm**
- **JWT Authentication**
- **API Versioning (v1, v2, …)**

This template helps you build production-grade server applications with clean architecture and maintainability in mind.

---

## 📁 Folder Structure
```
project-root/
├─ src/
│  ├─ config/
│  │   └─ index.ts
│  ├─ db/
│  │   └─ data-source.ts
│  ├─ core/
│  │   ├─ middlewares/
│  │   │   ├─ error.middleware.ts
│  │   │   ├─ auth.middleware.ts
│  │   │   └─ validate.dto.ts
│  │   ├─ utils/
│  │   │   └─ logger.ts
│  │   └─ exceptions/
│  │       └─ http.exception.ts
│  │   ├─ interfaces/
│  │   │   ├─ user.interface.ts
│  │   │   └─ auth.interface.ts
│  ├─ modules/
│  │   ├─ users/
│  │   │   ├─ user.entity.ts
│  │   │   ├─ user.dto.ts
│  │   │   ├─ user.repository.ts
│  │   │   ├─ v1/
│  │   │   │   ├─ user.service.ts
│  │   │   │   ├─ user.controller.ts
│  │   │   │   └─ user.routes.ts
│  │   ├─ auth/
│  │   │   ├─ auth.dto.ts
│  │   │   ├─ v1/
│  │   │   │   ├─ auth.service.ts
│  │   │   │   ├─ auth.controller.ts
│  │   │   │   └─ auth.routes.ts
│  │   │   └─ v2/(for adding versions)
│  ├─ app.ts
│  └─ server.ts
│
├─ .env.example
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
└─ README.md
```

---

## ✨ Features

- Modular **feature-based** architecture  
- **API Versioning** (e.g., `/api/auth/v1`, `/api/auth/v2`)  
- **JWT Authentication** (login)  
- **TypeORM** + PostgreSQL (entities, repositories, migrations-ready)  
- **DTO Validation** using class-validator  
- **Custom HTTP Exceptions**  
- **Global Error Handler**  
- **Winston Logger**  
- **ESM + Path Aliases**  
- Production-ready folder layout

---

## Path Aliases

The following path aliases are configured:

- `@modules/*` → `modules/*`
- `@app/*` → `app.ts*`
- `@config/*` → `config/index.ts*`
- `@db/*` → `db/data-source.ts*`
- `@core/*` → `core/**`

---

## Getting Started

### Prerequisites

- Operating System (MacOS X, Linux, Windows)
- [Nodejs (Version 23 or higher)](https://nodejs.org/en/docs/) to run npm commands
- [NVM](https://nodejs.org/en/docs/) to manage multiplenode versions
- PNPM — Fast and efficient package manager for installing dependencies  
- [Visual Studio](https://code.visualstudio.com/Download) Code as text editor
- [Postman](https://www.postman.com/downloads/) for building and using APIs
- [Postgresql](https://www.postgresql.org/) for database program. Note: make sure to remember the crendentials (username & password) upon installation
- [PgAdmin](https://www.pgadmin.org/) for database gui

### Clone the repository
```bash
git clone <repository-url>
cd project-root
```

## 📦 Installation

1. Install dependencies:
```bash
pnpm install
```
```bash
pnpm add express cors helmet morgan dotenv typeorm reflect-metadata pg class-validator class-transformer bcrypt jsonwebtoken cli-table3 chalk winston
```
```bash
pnpm add -D typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/morgan @types/bcrypt @types/jsonwebtoken tsc-alias tsconfig-paths nodemon
```

2. Configure environment variables in `.env`:
```env
DB_PORT=5432
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=password123
DATABASE_NAME=boilerplate_db
PORT=4000
NODE_ENV=development
JWT_ACCESS_SECRET=testaccesssecret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=testrefreshsecret
JWT_REFRESH_EXPIRES_IN=7d
```

### Development
Run the development server with auto-reload:
```bash
pnpm run dev
```

### Build
Compile TypeScript to JavaScript:
```bash
pnpm run build
```

### Production
Run the compiled application:
```bash
pnpm start
```

---

## Authentication
- The boilerplate comes with JWT authentication.
- Authorized endpoints require the ``Authorization`` header:
  ```bash
   Authorization:<JWT_TOKEN>
  ```
- Include the token in your request headers to access protected routes.
- Public routes can be accessed without the token.

## API Endpoints

### Health Check
- `GET /health` - Check API status

### 🛠 Tech Stack

| Technology | Purpose         |
| ---------- | --------------- |
| Node.js    | Runtime         |
| Express.js | Web Framework   |
| TypeScript | Typesafety      |
| PostgreSQL | Database        |
| TypeORM    | ORM             |
| pnpm       | Package Manager |
| JWT        | Authentication  |
| Winston    | Logging         |


### 👤 Author

Created by **Danilo Alingasa** – [LinkedIn](https://www.linkedin.com/in/danilo-alingasa-a727241a2/) | [GitHub](https://github.com/nadnad121021)