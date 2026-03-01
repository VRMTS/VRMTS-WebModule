# VRMTS Dockerization Guide

This project is fully dockerized for easy development and deployment. The setup includes a MySQL database, a Node.js backend, and a Vite/React frontend.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Quick Start

1.  **Clone the repository** (if you haven't already).
2.  **Initialize the Environment**:
    The setup expects a `dbtables.sql` file in the root directory for initial database seeding.
3.  **Run the Application**:
    ```bash
    docker compose up --build
    ```
4.  **Access the services**:
    - **Frontend**: [http://localhost](http://localhost) (mapped from internal port 80)
    - **Backend API**: [http://localhost:8080](http://localhost:8080)
    - **Database**: `localhost:3307` (mapped from internal port 3306)

## Common Commands

### Full Reset (Wipe Data & Rebuild)
If you need to reset the database and rebuild images:
```bash
docker compose down -v && docker compose up --build
```

### View Logs
```bash
# All logs
docker compose logs -f

# Specific service logs
docker compose logs -f backend
docker compose logs -f db
```

### Enter a Container
```bash
docker exec -it vrmts-backend-1 sh
```

## Architecture Details

- **MySQL (db)**: Uses the official MySQL 8 image. Initialized with `dbtables.sql`. Configuration includes `lower_case_table_names=1` for case-insensitivity.
- **Node.js (backend)**: Multi-stage build using `node:20-alpine`. Production-ready with pruned devDependencies.
- **React (frontend)**: Multi-stage build. First stage builds the assets, second stage serves them using Nginx on port 80.

## Troubleshooting

### Database Connection Failed
- Check if the `db` container is healthy: `docker compose ps`
- Ensure you aren't running another MySQL instance on port 3306 locally (this setup maps to 3307 to avoid conflicts).

### Content Security Policy (CSP) Errors
The frontend is configured to talk to `localhost:8080`. Ensure your browser allows connections to this port.
