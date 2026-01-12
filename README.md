# 🚀 Node.js + Express + TypeScript Boilerplate with Dynamic PostgreSQL / MySQL / MongoDB Support

A scalable backend boilerplate built with:

- **Node.js (ESM)**
- **Express.js**
- **PostgreSQL / MySQL / MongoDB (TypeORM)**
- **TypeScript**
- **pnpm**
- **JWT Authentication**
- **API Versioning (v1, v2, …)**

This template helps you build production-grade server applications with clean architecture and maintainability in mind, supporting PostgreSQL, MySQL, or MongoDB.

---

## 📁 Folder Structure
```
project-root/
├─ src/
│  ├─ config/
│  │   └─ index.ts
│  ├─ core/
│  │   ├─ enums/
│  │   │   └─ common.enum.ts
│  │   ├─ middlewares/
│  │   │   ├─ error.middleware.ts
│  │   │   ├─ auth.middleware.ts
│  │   │   └─ validate.dto.ts
│  │   ├─ utils/
│  │   │   ├─ cache.ts
│  │   │   ├─ jwt.ts
│  │   │   ├─ logger.ts
│  │   │   ├─ redisClient.ts
│  │   │   └─ versionedRouter.ts
│  │   └─ exceptions/
│  │       └─ http.exception.ts
│  │   ├─ interfaces/
│  │   │   ├─ user.interface.ts
│  │   │   └─ auth.interface.ts
│  ├─ db/
│  │   └─ data-source.ts
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
- [Nodejs (Version 23 or higher)](https://nodejs.org/en/docs/) to run npm commands (recommended version 23.11.0)
- [NVM](https://nodejs.org/en/docs/) to manage multiplenode versions
- PNPM — Fast and efficient package manager for installing dependencies  
- [Visual Studio](https://code.visualstudio.com/Download) Code as text editor
- [Postman](https://www.postman.com/downloads/) for building and using APIs
- Database (choose one based on your setup):
  Note: make sure to remember the crendentials (username & password) upon installation
   - [Postgresql](https://www.postgresql.org/) 
   - [MySQL](https://www.mysql.com/) 
   - [MongoDB](https://www.mongodb.com/)
- [PgAdmin](https://www.pgadmin.org/) / [MySQL Workbench](https://www.mysql.com/products/workbench/) /  [MongoDB Compass](https://www.mongodb.com/products/tools/compass) -  for database gui
- [Redis](https://redis.io/downloads/) for caching

### Clone the repository
```bash
git clone <repository-url>
cd project-root
```

## 📦 Installation

1. Install dependencies:
#### option 1 (recommended):
```bash
pnpm run prepare
```
#### option 2 (manual):
```bash
pnpm install
```
```bash
pnpm add express cors helmet morgan dotenv typeorm reflect-metadata pg class-validator class-transformer bcrypt jsonwebtoken cli-table3 chalk winston ioredis mysql2
```
```bash
pnpm add -D typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/morgan @types/bcrypt @types/jsonwebtoken tsc-alias tsconfig-paths nodemon
```

2. Configure environment variables in `.env`:
```env
# App
PORT=4000
NODE_ENV=development

# Enable or disable caching (redis)
ENABLE_CACHE=true

# Database (choose one: postgres, mysql, mongodb)
DB_TYPE=mysql
DB_SYNC=true # Set to true to auto-sync models with DB (development only)
DB_LOGGING=false

# For Postgres/MySQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=password123
# DB_NAME=boilerplate_db

# For MySQL
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=password123
DB_NAME=boilerplate_db

# For MongoDB
#DB_PORT=27017
#DB_USER=mongouser
#DB_PASSWORD=mongopass
#DB_NAME=mongodb_db
#DATABASE_URL= # Optional: full connection string, takes precedence

# JWT
JWT_ACCESS_SECRET=testaccesssecret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=testrefreshsecret
JWT_REFRESH_EXPIRES_IN=7d

# Redis (optional, for caching)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
#REDIS_PASSWORD=

```

## If Caching Enabled (Set Up Redis local)
✅ OPTION 1 (RECOMMENDED): Redis via WSL (Best & Stable) ⭐

This is the officially recommended way by Redis.

1️⃣ Install WSL
Open PowerShell (Run as Administrator):

```bash
wsl --install
```
🔁 Restart your PC when prompted.

2️⃣ Install Ubuntu
 - Open Microsoft Store
 - Install Ubuntu 22.04 LTS
 - Launch it
 - Create a Linux username/password

3️⃣ Install Redis inside Ubuntu
In the Ubuntu terminal:
```bash
sudo apt update
sudo apt install redis-server -y
```

4️⃣ Start Redis
```bash
sudo service redis-server start
```

5️⃣ Verify Redis
```bash
redis-cli ping
```
✅ Output:
```
PONG
```
Redis is now running on:
```
localhost:6379
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
| PostgreSQL / MySQL / MongoDB | Database        |
| TypeORM    | ORM             |
| pnpm       | Package Manager |
| JWT        | Authentication  |
| Winston    | Logging         |
| Redis      | Caching         |


### 👤 Author

Created by **Danilo Alingasa** – [LinkedIn](https://www.linkedin.com/in/danilo-alingasa-a727241a2/) | [GitHub](https://github.com/nadnad121021)