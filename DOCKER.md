Docker setup and Docker Hub push guide

Prerequisites
- Docker Desktop installed and running
- Docker Hub account

1) Set your Docker Hub username
- PowerShell:
  $env:DOCKERHUB_USERNAME="saim687"

Important
- Docker image namespaces must be lowercase. Use `saim687` (not `Saim687`).

2) Build both application images
- docker compose build customer admin

3) Start the full stack locally (apps + MySQL)
- docker compose up -d

4) Check containers
- docker compose ps

5) Open the app
- Customer: http://localhost:3000/login.html
- Admin: http://localhost:3001/adminlogin.html

6) Login to Docker Hub
- docker login

7) Push both app images
- docker compose push customer admin

8) Stop stack
- docker compose down

9) Remove stack and DB volume (optional reset)
- docker compose down -v

Notes
- MySQL is initialized automatically from:
  - GROCERY_USER.sql
  - ADMIN_GROCERY.sql
- MySQL container is exposed on host port `3307` to avoid conflicts with local MySQL on `3306`.
- App images use tags:
  - ${DOCKERHUB_USERNAME}/grocery-customer:latest
  - ${DOCKERHUB_USERNAME}/grocery-admin:latest
