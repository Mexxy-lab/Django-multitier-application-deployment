# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Exposing Minikube-Based Application via Cloudflare Tunnel

This guide walks you through deploying a multi-tier application (frontend, backend, MySQL) on Kubernetes using Minikube, with public HTTPS access via Cloudflare Tunnel and TLS certificates from Let's Encrypt.

---

## 🧱 Architecture Overview

- **Kubernetes**: Minikube on Ubuntu 22.04
- **Ingress**: NGINX Ingress installed from GitHub YAML
- **App Components**:
  - Frontend (port `80`)
  - Backend (port `5000`)
  - MySQL (port `3306`)
- **Domain**: `madeep.shop` managed via Cloudflare
- **Tunnel Access**: `django.madeep.shop` via Cloudflare Tunnel

---

## ✅ Prerequisites

- Minikube running locally
- Domain registered on Cloudflare (e.g., `madeep.shop`)
- Cloudflare account & API access
- `cloudflared` installed
- Ingress NGINX installed via YAML:

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
  ```

---

## 🔧 Step-by-Step Setup

### 1️⃣ Deploy Your App

Deploy frontend, backend, MySQL, and Ingress resources.

#### Example Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: django
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  rules:
  - host: django.madeep.shop
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: ImplementationSpecific
        backend:
          service:
            name: backend-service
            port:
              number: 5000
  tls:
  - hosts:
    - django.madeep.shop
    secretName: django-tls
```

Apply Ingress:

```bash
kubectl apply -f app-ingress.yaml
```

---

### 2️⃣ Install cert-manager & ClusterIssuer

Install cert-manager (for Let’s Encrypt TLS):

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.1/cert-manager.yaml
```

#### Create `cluster-issuer.yaml`

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
  namespace: django
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: madeep9347@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply it:

```bash
kubectl apply -f cluster-issuer.yaml
```

---

### 3️⃣ Port-Forward NGINX Ingress Locally

```bash
kubectl port-forward svc/ingress-nginx-controller 8085:80 -n ingress-nginx
kubectl port-forward svc/ingress-nginx-controller 8086:80 -n ingress-nginx
```

---

### 4️⃣ Configure Cloudflare Tunnel

#### Install `cloudflared`

```bash
sudo apt install -y cloudflared
```

#### Authenticate & Create Tunnel

```bash
cloudflared tunnel login
cloudflared tunnel create django-tunnel
```

#### Configure Tunnel

```bash
sudo nano /etc/cloudflared/config.yml
```

Paste the following:

```yaml
tunnel: ee4fb984-c29b-4ab5-83a8-f9eb3c5b5af2
credentials-file: /home/nepra/.cloudflared/ee4fb984-c29b-4ab5-83a8-f9eb3c5b5af2.json

ingress:
  - hostname: app.madeep.shop
    service: http://127.0.0.1:8085
  - hostname: django.madeep.shop
    service: http://127.0.0.1:8086
  - service: http_status:404
```

---

### 5️⃣ Start Cloudflared as a Service

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

Ensure status is `active (running)`.

---

### 6️⃣ Configure Cloudflare DNS

Link your domain to the tunnel:

```bash
cloudflared tunnel route dns django-tunnel django.madeep.shop
```

Or add manually via Cloudflare Dashboard:

- Type: `CNAME`
- Name: `django`
- Target: `<your-tunnel-id>.cfargotunnel.com`
- Proxy status: **Proxied**

---

## ✅ Final Checks

- DNS resolves:

  ```bash
  dig CNAME django.madeep.shop +short
  ```

- Check ingress:

  ```bash
  kubectl get ingress -n django
  ```

Now visit:  
🔗 <https://django.madeep.shop>

You should see your frontend served over HTTPS.

---

## 🧼 Cleanup

To remove everything:

```bash
cloudflared tunnel delete django-tunnel
kubectl delete -f app-ingress.yaml
kubectl delete -f cluster-issuer.yaml
```

---

## 📧 Contact

**Author**: Emeka U.
📬 <pumej1985@gmail.com>
🌐 [https://github.com/Mexxy-lab](https://github.com/emeka-umejiofor)
