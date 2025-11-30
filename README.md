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

### 🎬 Video Walkthrough (YouTube): [https://youtu.be/V_LmJB9ZXu0](https://youtu.be/xn3FOB3I4BE)
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
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

---
# ⚙️ AWS & Kubernetes Setup 

Follow these steps **exactly**, in order.

---

# 1️⃣ Create ECR Repositories

From your local machine (with AWS CLI configured):

```bash
aws ecr create-repository \
  --repository-name issue-tracker-frontend \
  --region ap-south-1

aws ecr create-repository \
  --repository-name issue-tracker-backend \
  --region ap-south-1
```

---

# 2️⃣ Install eksctl locally

```bash
curl --silent --location "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" \
  | tar xz -C /tmp

sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```

---

# 3️⃣ Create the EKS Cluster

Run from your **laptop**:

```bash
eksctl create cluster \
  --name issue-tracker-cluster \
  --region ap-south-1 \
  --nodegroup-name issue-tracker-nodes \
  --node-type t3.small \
  --nodes 2 \
  --managed
```

When finished, confirm:

```bash
kubectl get nodes
```

---

# 4️⃣ Create IAM Role for GitHub Actions (MANDATORY)

### Step 1 → Add GitHub OIDC Provider

In AWS IAM → **Identity providers → Add provider**

* Provider: **GitHub**
* Audience: **sts.amazonaws.com**

### Step 2 → Create IAM Role `GitHubActionsEKSRole`

Use “Web Identity” with the GitHub provider above.

### Step 3 → Trust Policy

Replace `your-org` and `your-repo`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:nipun221/issue-tracker:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### Step 4 → Attach Permissions Policy

Attach:

* AmazonEC2ContainerRegistryFullAccess
* AmazonEKSClusterPolicy
* AmazonEKSWorkerNodePolicy
* AmazonEKS_CNI_Policy
* IAMReadOnlyAccess
* Custom inline allowing:

```json
{
  "Effect": "Allow",
  "Action": [
    "eks:DescribeCluster",
    "eks:DescribeNodegroup",
    "eks:ListClusters"
  ],
  "Resource": "*"
}
```

---

# 5️⃣ Add Role to EKS (VERY IMPORTANT)

```bash
kubectl edit configmap aws-auth -n kube-system
```

Paste under `mapRoles:`:

```yaml
- rolearn: arn:aws:iam::<ACCOUNT_ID>:role/GitHubActionsEKSRole
  username: github-actions
  groups:
    - system:masters
```

This gives your GitHub workflow cluster admin for deployment.

---

# 6️⃣ GitHub Actions Variables

Add these in **Repository → Settings → Variables**:

```
AWS_REGION = ap-south-1
AWS_ACCOUNT_ID = 15882564789
EKS_CLUSTER_NAME = issue-tracker-cluster
```

---

# 7️⃣ Deploy via GitHub Actions

Push to main:

```bash
git add .
git commit -m "trigger deployment"
git push
```

GitHub Actions will:

* build images
* push to ECR
* update EKS manifests
* rollout updates

---

# ☸️ Kubernetes Deployment (Updated)

### MongoDB

Your demo database uses `emptyDir:` (ephemeral).
Data resets when the Mongo pod is replaced.

### Backend

Connects via DNS:

```
mongodb://mongo:27017/issue_tracker
```

### Frontend

Served via LoadBalancer
Backend API resolved via cluster DNS.

---

# 🧪 Testing the Deployed App

Get the frontend URL:

```bash
kubectl get svc -n issue-tracker
```

Open in browser → create issues → watch app work end-to-end.

---

# 📸 **Screenshots**

* EKS node view: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-56-56 Elastic Kubernetes Service ap-south-1" src="https://github.com/user-attachments/assets/d5e60980-182d-431b-a1d9-fc2039bbc521" />

* GitHub Actions workflow success: <img width="1920" height="988" alt="Screenshot 2025-11-30 at 09-54-10 title update in App jsx · nipun221_issue-tracker@48a3837" src="https://github.com/user-attachments/assets/0098e126-9a3c-49d2-ba58-7845d0a42748" />

* UI screenshot after deployment: <img width="1920" height="1191" alt="Screenshot 2025-11-30 at 17-30-54 Issue Tracker" src="https://github.com/user-attachments/assets/ea2760a4-de2f-457b-9f69-b35af2ac80eb" />

* ECR repo: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-54-24 Elastic Container Registry - Private repositories" src="https://github.com/user-attachments/assets/7e6c45a4-8b5f-4ac7-8506-6cce166efffe" />

* ECR repo backend:  <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-54-36 Elastic Container Registry - Private repository" src="https://github.com/user-attachments/assets/c25840c3-4fe0-453c-8b63-96c7ed62e45f" />

* ECR repo frontend: <img width="1920" height="950" alt="Screenshot 2025-11-30 at 09-54-49 Elastic Container Registry - Private repository" src="https://github.com/user-attachments/assets/d71b3540-1dd0-465a-a08b-456be641ad10" />

* Services info: <img width="1225" height="417" alt="Screenshot_20251130_095821" src="https://github.com/user-attachments/assets/bf8ec794-1d9e-43dd-a424-191515f59a79" />


---

# 🗑 Cleaning Up (To Stop Billing)

Run these **in exact order**:

### 1. Delete workloads & namespace

```bash
kubectl delete namespace issue-tracker
```

### 2. Delete EKS cluster

```bash
eksctl delete cluster \
  --name issue-tracker-cluster \
  --region ap-south-1
```

### 3. Delete ECR repos

```bash
aws ecr delete-repository --repository-name issue-tracker-frontend --force --region ap-south-1
aws ecr delete-repository --repository-name issue-tracker-backend --force --region ap-south-1
```

### 4. Delete IAM role

Manually delete `GitHubActionsEKSRole` in AWS console.

### 5. Do NOT delete Default VPC

AWS recreates it automatically → leave it.

---

# 🎯 **What You’ll Learn From This Project**

1. GitHub Actions CI/CD
2. AWS IAM Roles (OIDC)
3. Pushing Docker images to ECR
4. Deploying microservices to Kubernetes
5. Managing multi-tier applications in EKS
6. DNS-based service discovery
7. Infrastructure as Code (EKSctl)

---

# ⭐ **If this project helped you, star the repo!**

This motivates me to create more DevOps projects and tutorials.

---
