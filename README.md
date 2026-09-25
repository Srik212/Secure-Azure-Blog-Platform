# Azure Secure Blog Platform

A cloud-hosted blog platform built on **Microsoft Azure** to apply practical cloud platform engineering and security concepts while preparing for the **Microsoft SC-500: Cloud and AI Security Engineer** certification.

The project focuses on deploying a simple application while progressively securing the surrounding Azure environment using identity, networking, secrets management, monitoring, security posture management, and automated deployment controls.

> **Project Status:** Ongoing Development

---

## Project Objectives

The goal of this project is to gain hands-on experience designing, deploying, securing, monitoring, and troubleshooting an application hosted on Microsoft Azure.

Key objectives include:

* Deploying a web application using Azure managed services
* Implementing identity-based access instead of static credentials
* Protecting application secrets using Azure Key Vault
* Restricting unnecessary public network exposure
* Implementing private connectivity between Azure services
* Applying security policies and cloud guardrails
* Monitoring application and infrastructure activity
* Reviewing security posture using Microsoft Defender for Cloud
* Automating application deployment using CI/CD

---

## Architecture

The initial architecture consists of:

```text
                     Internet
                        |
                        v
                +----------------+
                | Azure App      |
                | Service        |
                +----------------+
                        |
               Managed Identity
                        |
          +-------------+-------------+
          |                           |
          v                           v
 +----------------+          +----------------+
 | Azure Key      |          | Azure SQL      |
 | Vault          |          | Database       |
 +----------------+          +----------------+
          |                           |
          +------ Private Access -----+
                        |
                   Azure VNet

Supporting Services:

Microsoft Entra ID
Azure RBAC
Azure Policy
Microsoft Defender for Cloud
Azure Monitor
Log Analytics
GitHub Actions
```

The architecture will evolve as additional security and platform engineering controls are implemented.

---

## Azure Services

### Azure App Service

The blog application is hosted using **Azure App Service**, providing a managed platform for deploying and operating the web application.

Areas explored include:

* Application deployment
* Configuration management
* Application settings
* Managed Identity
* VNet integration
* Logging and monitoring

---

### Microsoft Entra ID

Microsoft Entra ID is used to explore identity and access management concepts including:

* Authentication
* Role-Based Access Control
* Service identities
* Least-privilege access
* Workload identity concepts

---

### Managed Identity

The application uses **Azure Managed Identity** where possible to authenticate with Azure resources without storing long-lived credentials inside application code.

This reduces dependency on:

```text
Hard-coded passwords
Connection credentials
API secrets
Static service credentials
```

---

## Azure Key Vault

Sensitive configuration and application secrets are stored using **Azure Key Vault**.

The application retrieves required secrets using its Managed Identity.

Security concepts explored include:

* Centralized secrets management
* Identity-based access
* RBAC
* Secret rotation concepts
* Removal of credentials from source code

---

## Network Security

The project explores Azure networking and application isolation using:

* Azure Virtual Network
* Subnets
* Network Security Groups
* Private Endpoints
* DNS resolution
* Inbound and outbound traffic controls

The long-term goal is to minimize unnecessary public exposure of backend resources.

Example communication flow:

```text
Internet
    |
    v
App Service
    |
    | Private Connectivity
    v
Azure SQL Database
```

---

## Azure SQL Database

Azure SQL Database provides persistent storage for blog data such as:

* Users
* Blog posts
* Comments
* Application metadata

Security configuration will focus on:

* Restricted network access
* Private connectivity
* Authentication
* Encryption
* Identity-based access where supported

---

## Microsoft Defender for Cloud

**Microsoft Defender for Cloud** is used to review the security posture of the Azure environment.

The project explores:

* Security recommendations
* Misconfiguration detection
* Secure Score
* Cloud workload protection concepts
* Vulnerability findings
* Security posture improvements

Recommendations will be reviewed and remediated where appropriate.

---

## Azure Policy

Azure Policy is used to understand how organizations establish **cloud governance and security guardrails**.

Planned examples include policies for:

* Restricting insecure configurations
* Identifying publicly exposed resources
* Enforcing required resource configuration
* Auditing security settings
* Supporting compliance requirements

---

## Monitoring and Logging

The platform uses:

* Azure Monitor
* Log Analytics
* Application logs
* Azure activity logs

Monitoring is intended to provide visibility into:

* Application availability
* Authentication activity
* Resource health
* Configuration changes
* Platform errors
* Network connectivity issues
* Security events

---

## CI/CD

Application deployment is automated using **GitHub Actions**.

Planned pipeline flow:

```text
Developer Push
      |
      v
GitHub Repository
      |
      v
Build Application
      |
      v
Security Checks
      |
      v
Deploy to Azure
      |
      v
Validation
```

Future security checks may include:

* Secret scanning
* Dependency scanning
* Static application security testing
* Infrastructure-as-Code scanning

---

## Security Principles

The project is being built around several core security principles.

### Least Privilege

Users, workloads, and services should receive only the permissions required to perform their intended function.

### Identity over Credentials

Managed identities are preferred over embedded usernames, passwords, or long-lived application credentials.

### Defense in Depth

Security controls are implemented across multiple layers:

```text
Identity
   |
Network
   |
Application
   |
Data
   |
Monitoring
```

### Reduced Public Exposure

Backend services should not be publicly accessible unless there is a legitimate requirement.

### Centralized Visibility

Logs and security events should be centrally available for troubleshooting and investigation.

---

## SC-500 Learning Alignment

This project is being developed alongside preparation for the **Microsoft SC-500 Cloud and AI Security Engineer** certification.

It provides practical exposure to concepts including:

* Microsoft Entra ID
* Azure RBAC
* Managed Identity
* Azure Key Vault
* Azure networking
* Private Endpoints
* Microsoft Defender for Cloud
* Azure Policy
* Azure Monitor
* Log Analytics
* Cloud security posture management
* Workload protection
* Secrets management

---

## Project Roadmap

### Phase 1 — Application Deployment

* [ ] Build basic blog application
* [ ] Deploy application to Azure App Service
* [ ] Configure Azure SQL Database
* [ ] Validate application connectivity

### Phase 2 — Identity and Secrets

* [ ] Enable App Service Managed Identity
* [ ] Configure Azure RBAC
* [ ] Create Azure Key Vault
* [ ] Move application secrets into Key Vault
* [ ] Remove hard-coded credentials

### Phase 3 — Network Security

* [ ] Create Azure Virtual Network
* [ ] Configure subnets
* [ ] Implement Network Security Groups
* [ ] Configure Private Endpoint for Azure SQL
* [ ] Configure private access to Key Vault
* [ ] Validate DNS and routing

### Phase 4 — Security Guardrails

* [ ] Enable Microsoft Defender for Cloud
* [ ] Review security recommendations
* [ ] Configure Azure Policy
* [ ] Remediate identified configuration weaknesses

### Phase 5 — Monitoring

* [ ] Configure Azure Monitor
* [ ] Create Log Analytics Workspace
* [ ] Enable application logging
* [ ] Create monitoring alerts
* [ ] Test troubleshooting scenarios

### Phase 6 — CI/CD

* [ ] Build GitHub Actions workflow
* [ ] Automate application build
* [ ] Automate Azure deployment
* [ ] Add security scanning
* [ ] Implement deployment validation

### Phase 7 — Infrastructure as Code

* [ ] Recreate core Azure infrastructure using Terraform
* [ ] Define reusable variables
* [ ] Implement remote state
* [ ] Add Infrastructure-as-Code security scanning
* [ ] Document Terraform deployment process

---

## Troubleshooting Scenarios

The project will also be used to practice real-world Cloud Platform Engineering scenarios.

Examples include:

```text
Application cannot connect to Azure SQL

App Service cannot retrieve Key Vault secrets

Private Endpoint DNS resolution fails

Managed Identity receives 403 Forbidden

Deployment succeeds but application is unavailable

NSG blocks required traffic

Azure SQL remains publicly accessible

GitHub Actions deployment fails

Application performance suddenly degrades
```

Each scenario will eventually include:

```text
Problem
   ↓
Evidence
   ↓
Investigation
   ↓
Root Cause
   ↓
Remediation
   ↓
Validation
   ↓
Prevention
```

---

## Technologies

**Cloud**

* Microsoft Azure

**Compute**

* Azure App Service

**Identity**

* Microsoft Entra ID
* Azure RBAC
* Managed Identity

**Networking**

* Azure Virtual Network
* Subnets
* Network Security Groups
* Private Endpoints
* DNS

**Security**

* Azure Key Vault
* Microsoft Defender for Cloud
* Azure Policy

**Monitoring**

* Azure Monitor
* Log Analytics

**Database**

* Azure SQL Database

**DevOps**

* GitHub
* GitHub Actions
* Terraform — planned

---

## Future Improvements

Future versions of the project may include:

* Azure Application Gateway
* Web Application Firewall
* Containerized deployment
* Azure Container Registry
* Azure Kubernetes Service
* Terraform-based provisioning
* Infrastructure-as-Code security scanning
* Microsoft Sentinel integration
* Advanced Defender for Cloud configuration
* Automated policy enforcement
* Cost monitoring and optimization

---

## Why I Built This Project

My professional background began in enterprise application development, where I worked on application workflows, APIs, integrations, debugging, databases, and the software development lifecycle.

After completing graduate studies in Information Systems Security, I began transitioning toward **Cloud Platform Engineering and Cloud Security**.

This project allows me to connect those areas by understanding not only how an application is developed, but also how it is:

**deployed → networked → authenticated → secured → monitored → troubleshot → automated**

in a modern cloud environment.

---

## Disclaimer

This repository represents a personal learning project and lab environment.

The architecture and security controls are continuously evolving as additional Azure and cloud-platform engineering concepts are implemented.
