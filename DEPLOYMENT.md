# 🚀 Deployment Guide: Render + MongoDB

Follow these steps to deploy your **Quizzax Assessment Platform** to production.

## 1. Prepare MongoDB (Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Shared Cluster** (Free).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Under **Database Access**, create a user with a password.
5. Click **Connect** -> **Drivers** -> Copy your **Connection String**.
   - *It looks like*: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/quiz_app?retryWrites=true&w=majority`

## 2. Push to GitHub
1. Create a new repository on GitHub.
2. Link your local project and push:
   ```bash
   git init
   git add .
   git commit -m "Finalizing for deployment"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

## 3. Deploy to Render
1. Sign in to [Render](https://render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and configure the service:
   - **Name**: `quizzax-platform`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. **CRITICAL**: Go to the **Environment** tab in your Render dashboard:
   - Add `MONGO_URI` and paste your connection string from Step 1.
   - Click **Save Changes**.

## 4. Final Verification
1. Once the build is green, open your Render URL.
2. The app should load the Login page. 
3. After logging in, try refreshing the page—it will correctly remember your page thanks to the state persistence we implemented!

---
> [!IMPORTANT]
> Ensure you replace `<password>` in your `MONGO_URI` with your actual database user password.
