## Docker Setup (Alternative)

Run the entire application with one command using Docker.

### Prerequisites
- Install Docker Desktop from https://www.docker.com/products/docker-desktop/

### Run with Docker
```bash
docker-compose up --build
```

This will automatically:
- Start MySQL and create all tables
- Start the backend on port 5000
- Start the frontend on port 3000

Open browser at `http://localhost:3000`

### Stop Docker
```bash
docker-compose down
```