<p align="center">

  <!-- Badges -->
  <img src="https://img.shields.io/github/actions/workflow/status/nipun221/issue-tracker/deploy.yml?label=CI%2FCD&logo=github&style=for-the-badge" />

  <img src="https://img.shields.io/badge/AWS-EKS-FF9900?logo=amazon-eks&logoColor=white&style=for-the-badge" />

  <img src="https://img.shields.io/badge/AWS-ECR-232F3E?logo=amazon-aws&logoColor=white&style=for-the-badge" />

  <img src="https://img.shields.io/badge/Containerized-Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge" />

  <img src="https://img.shields.io/badge/Kubernetes-Production%20Ready-326CE5?logo=kubernetes&logoColor=white&style=for-the-badge" />

  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black&style=for-the-badge" />

  <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" />

  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />

</p>


# 🚀 Issue Tracker — Full CI/CD on AWS (ECR + EKS)

## **React + Node.js + MongoDB | GitHub Actions| Docker | ECR | Kubernetes**

### 🎬 Video Walkthrough (YouTube): https://youtu.be/V_LmJB9ZXu0
This project is a **3-tier cloud-native Issue Tracker application** deployed using a **fully automated CI/CD pipeline**.
Every push to `main` triggers GitHub Actions, which:

1. Builds Docker images for the **frontend** and **backend**
2. Pushes them to **Amazon ECR**
3. Deploys them to **Amazon EKS**
4. Updates the running application with **zero downtime**

This repository is excellent for learning real-world DevOps pipelines and modern Kubernetes deployments.

---

## 🏗️ **Architecture**

```
               ┌──────────────────┐
               │   GitHub Repo     │
               └─────────┬────────┘
                         │ Push (main)
                         ▼
                 ┌──────────────────┐
                 │ GitHub Actions CI │
                 └───────┬──────────┘
       Builds & Pushes    │
    Docker Images → ECR    ▼
         ┌──────────────────────────────┐
         │  AWS Elastic Container Reg.  │
         └──────────────┬──────────────┘
                        ▼
                ┌──────────────────┐
                │     AWS EKS       │
                └──────────────────┘
              (Frontend | Backend | Mongo)
```

---
## **Professional Project Diagram: Mermaid**

```
flowchart LR
    A[Developer Push to main] --> B[GitHub Actions]

    subgraph CI/CD Pipeline
        B --> C[Build Docker Images]
        C --> D[Push to Amazon ECR]
        D --> E[Update kubeconfig]
        E --> F[Deploy to EKS via kubectl]
    end

    subgraph AWS EKS Cluster
        F --> G[Frontend Deployment\n(React + NGINX)]
        F --> H[Backend Deployment\n(Node.js + Express)]
        F --> I[MongoDB Deployment]
        
        H --> I
        G --> H
    end

    G --> J[(LoadBalancer Service)]
    J --> K[End User Browser]
```

---

## ✨ **Features**

### 🔹 Application

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Database:** MongoDB
* Clean UI for Issue creation + listing

### 🔹 DevOps / Cloud

* Fully containerized with Docker
* Kubernetes deployments for ALL services
* MongoDB deployed directly in cluster
* CI/CD using GitHub Actions
* ECR as image registry
* EKS (managed Kubernetes) for hosting
* Automatic application rollout on every push
* Namespaces + services + deployments

---

## 📂 **Repository Structure**

```
.
├── frontend/                 # React app
├── backend/                  # Express API
├── k8s/
│   ├── namespace.yml
│   ├── mongo-deployment.yml
│   ├── backend-deployment.yml
│   ├── frontend-deployment.yml
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions CI/CD pipeline
└── README.md
```

---

# ⚙️ **CI/CD Pipeline (GitHub Actions)**

### ✔️ Trigger

Pipeline runs on every push to `main`:

```yaml
on:
  push:
    branches: [ "main" ]
```

### ✔️ Major Steps

1. **Checkout repo**
2. **Assume AWS IAM Role using OIDC**
3. **Login to ECR**
4. **Build & push Docker images**
5. **Update kubeconfig for EKS**
6. **Apply K8s manifests**
7. **Update Deployment images using set image**
8. **Wait for rollout**

**This guarantees zero-downtime deployment**.

---

# 🐳 **Dockerization**

Both apps include lightweight production Dockerfiles:

### **Backend Dockerfile (Node.js)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["node", "src/server.js"]
```

### **Frontend Dockerfile (React + Vite)**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

# ☸️ **Kubernetes Deployment Overview**

### MongoDB

* 1 replica (demo)
* ClusterIP service
* `emptyDir:` storage (for demo only)

### Backend (Express)

* 2 replicas
* Talks to Mongo via DNS:

```
mongodb://mongo:27017/issue_tracker
```

### Frontend (React)

* Exposed using LoadBalancer service
* Talks to backend via K8s DNS:

```
http://backend.issue-tracker.svc.cluster.local:4000/api
```

---

# 🔐 **IAM & Security**

GitHub Actions assumes an IAM Role:

```
GitHubActionsEKSRole
```

With:

* ECR Push
* EKS Access
* kubectl permissions

This is done via AWS OIDC provider (no secrets saved).

---

# 🧪 **How to Test the App (After Deployment)**

### 1️⃣ Get frontend LB URL:

```bash
kubectl get svc -n issue-tracker
```

Example output:

```
frontend   LoadBalancer   xxx.ap-south-1.elb.amazonaws.com   80:32471/TCP
```

### 2️⃣ Open URL

You can:

* Create an issue
* View issues
* Test end-to-end functionality

Logs:

```bash
kubectl logs deployment/backend -n issue-tracker
```

---

# 📦 **Kubernetes Commands (Quick Reference)**

### Apply All Manifests

```bash
kubectl apply -f k8s/ -n issue-tracker
```

### Check Pods

```bash
kubectl get pods -n issue-tracker
```

### Check Rollout

```bash
kubectl rollout status deployment/backend -n issue-tracker
kubectl rollout status deployment/frontend -n issue-tracker
```

---

# 📸 **Screenshots**

* EKS node view: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-56-56 Elastic Kubernetes Service ap-south-1" src="https://github.com/user-attachments/assets/d5e60980-182d-431b-a1d9-fc2039bbc521" />

* GitHub Actions workflow success: <img width="1920" height="988" alt="Screenshot 2025-11-30 at 09-54-10 title update in App jsx · nipun221_issue-tracker@48a3837" src="https://github.com/user-attachments/assets/0098e126-9a3c-49d2-ba58-7845d0a42748" />

* UI screenshot after deployment: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-59-18 Issue Tracker" src="https://github.com/user-attachments/assets/5608a6c1-aed2-43df-b8de-f976458cc974" />

* ECR repo: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-54-24 Elastic Container Registry - Private repositories" src="https://github.com/user-attachments/assets/7e6c45a4-8b5f-4ac7-8506-6cce166efffe" />

* ECR repo backend:  <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-54-36 Elastic Container Registry - Private repository" src="https://github.com/user-attachments/assets/c25840c3-4fe0-453c-8b63-96c7ed62e45f" />

* ECR repo frontend: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-54-49 Elastic Container Registry - Private repository" src="https://github.com/user-attachments/assets/d71b3540-1dd0-465a-a08b-456be641ad10" />

* Services info: <img width="1225" height="417" alt="Screenshot_20251130_095821" src="https://github.com/user-attachments/assets/bf8ec794-1d9e-43dd-a424-191515f59a79" />


---

# 🚀 **How to Reproduce This Project (Local Setup)**

### 1️⃣ Clone repo

```bash
git clone https://github.com/<your-username>/issue-tracker.git
```

### 2️⃣ Start backend

```bash
cd backend && npm install && npm run dev
```

### 3️⃣ Start frontend

```bash
cd frontend && npm install && npm run dev
```

### 4️⃣ Local Mongo

```bash
docker run -d --name issue-mongo -p 27017:27017 mongo:6
```

---

# 🎯 **What You’ll Learn From This Project**

✔ GitHub Actions CI/CD
✔ AWS IAM Roles (OIDC)
✔ Pushing Docker images to ECR
✔ Deploying microservices to Kubernetes
✔ Managing multi-tier applications in EKS
✔ DNS-based service discovery
✔ Infrastructure as Code (EKSctl)

---

# ⭐ **If this project helped you, star the repo!**

This motivates me to create more DevOps projects and tutorials.

---
