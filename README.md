# 🚀 Issue Tracker — Full CI/CD on AWS (ECR + EKS)

### **React + Node.js + MongoDB | GitHub Actions| Docker | ECR | Kubernetes**

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

# 📸 **Screenshots (Optional)**

*(You can add actual screenshots later)*

* EKS node view
* GitHub Actions workflow success
* UI screenshot before/after deployment
* ECR repo
* Service LoadBalancer URL

---

# 🎬 **Video Walkthrough (YouTube)**

Add link after upload:
`📌 https://youtube.com/...`

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
