<div align="center">

# 🛒 Microservice Ecommerce Platform 
  
This is a scalable and modular eCommerce backend system built using the microservices architecture pattern. Each service is independently developed and maintained, which helps in scalability, maintainability and fault isolation. The services communicate via REST APIs and are orchestrated using Docker and Docker Compose.

## 🌐 LIVE - SERVICE 
Visit the 👉 [_LINK 🔗_](http://bit.ly/4nZM33p)
</div> 
 <!-- https://e-commerce-microservice-gnvx.onrender.com/ -->

---

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started: Local Setup](#getting-started-local-setup)
  - [Prerequisites](#prerequisites)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Set Up Databases & Environment](#step-2-set-up-databases--environment)
  - [Step 3: Run Database Migrations](#step-3-run-database-migrations)
  - [Step 4: Run the Application](#step-4-run-the-application)
- [Deployment Guide (Render.com)](#deployment-guide-rendercom)

---

## Project Structure

The project is organized into two main directories:

-   **`api-gateway`**: This is the main entry point for all client requests. It's a lightweight Node.js service responsible for routing incoming requests to the appropriate microservice. It also handles concerns like rate limiting and API composition.

-   **`services`**: This directory contains all the individual microservices. Each service is a self-contained application with its own database, business logic, and API.
    -   `auth`: Manages user authentication, registration, and token verification.
    -   `products`: Manages product information, including creation and retrieval.
    -   `inventorys`: Manages product stock and inventory levels.
    -   `users`: Manages user profile information.
    -   `cart`: Manages the user's shopping cart.
    -   `order`: Manages order creation and processing.
    -   `email`: Manages sending emails for various events (e.g., registration).

---

## Getting Started: Local Setup

Follow these steps to get the entire application running on your local machine.

### Prerequisites

-   **Node.js and Yarn:** You must have Node.js (v16 or later) and Yarn package manager installed.
-   **Docker:** Docker is required to easily run the PostgreSQL databases needed by the services.

### Step 1: Install Dependencies

You must install the dependencies for each service individually. Open your terminal at the project root and run these commands:

```bash
# API Gateway
cd api-gateway && yarn install && cd ..

# Auth Service
cd services/auth && yarn install && cd ../..

# Products Service
cd services/products && yarn install && cd ../..

# User Service
cd services/user && yarn install && cd ../..

# ... Repeat for all other services (cart, order, inventorys, email etc.)
```

### Step 2: Set Up Databases & Environment

1.  **Start Databases with Docker:** If a `docker-compose.yml` file is provided, you can spin up all necessary databases. From the project root, run:
    ```bash
    docker-compose up -d
    ```
    If not, you will need to start a PostgreSQL instance manually for each service that needs one.

2.  **Create `.env` Files:** Each service requires a `.env` file for its configuration, including the database connection string.

    -   **For each service in the `services` directory (e.g., `services/auth`):**
        -   Create a file named `.env`.
        -   Add the appropriate `DATABASE_URL`. It will look something like this: `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"`

    -   **For the API Gateway (`api-geteway`):**
        -   Create a file named `.env`.
        -   Add the port number:
            ```
            PORT=8080
            ```

### Step 3: Run Database Migrations

Before starting the services, you need to set up the database schemas by running migrations for each service that uses Prisma.

Open a terminal for each service and run its migration command:

```bash
# Example for a service in services/some-service
cd services/some-service
yarn migrate:dev
```
You will need to repeat this for every service that has a `migrate:dev` script in its `package.json`.

### Step 4: Run the Application

Now, you can start all the services. **You must open a separate terminal for each service** as they need to run concurrently.

-   **Terminal 1 (API Gateway):**
    ```bash
    cd api-gateway
    yarn dev
    ```
    *You should see: `Server is running on port 8080` and you can visit `http://localhost:8080` to see the welcome message.*

-   **Terminal 2 (Auth Service):**
    ```bash
    cd services/auth
    yarn dev
    ```

-   **Terminal 3 (Products Service):**
    ```bash
    cd services/products
    yarn dev
    ```

-   **... Continue this process for all services.**

Once all services are running, you can access the API Gateway at `http://localhost:8080`.

---

## Deployment Guide (Render.com)

You can deploy this entire microservices application to the cloud using [Render](https://render.com/).

1.  **Modify `package.json`**: For each service (including the `api-geteway`), add a `start` script to its `package.json` file. This is what Render will use to run your application in production.

    ```json
    "scripts": {
      "start": "node dist/src/index.js",
      "dev": "ts-node-dev -r tsconfig-paths/register ./src/index.ts",
      "build": "tsc && tsc-alias"
    },
    ```

2.  **Deploy Each Service on Render**: For *each* service (`api-geteway`, `auth`, `products`, etc.), you will create a new **Web Service** on Render with the following configuration:
    -   **Root Directory**: Set this to the specific service's folder (e.g., `api-geteway` or `services/auth`).
    -   **Environment**: `Node`.
    -   **Build Command**: `yarn && yarn build`.
    -   **Start Command**: `yarn start`.
    -   **For services with migrations**, you may need to chain the migration command into the build command: `yarn && yarn build && yarn migrate:prod`.

3.  **Set Up Databases on Render**: For each service requiring a database, create a new **PostgreSQL** instance on Render and add its internal connection string as a `DATABASE_URL` environment variable in the corresponding Render service settings.

4.  **Configure API Gateway Environment Variables**: In the Render settings for your `api-geteway` service, you must add environment variables that point to the live URLs of your other deployed services.
