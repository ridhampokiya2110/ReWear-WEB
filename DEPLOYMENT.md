# 🚀 Deploy ReWear to Render (Free Hosting + Domain)

This guide will help you deploy your ReWear project to Render with a free domain and hosting.

## 📋 Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free)

## 🎯 What You'll Get

- **Frontend URL**: `https://rewear-frontend.onrender.com`
- **Backend URL**: `https://rewear-backend.onrender.com`
- **Free SSL Certificate** ✅
- **Automatic Deployments** ✅
- **750 hours/month free** ✅

## 📝 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rewear.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `rewear-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `CLIENT_URL` = `https://rewear-frontend.onrender.com`

6. **Click "Create Web Service"**

### Step 3: Deploy Frontend to Render

1. **Click "New +"** → **"Static Site"**
2. **Connect the same GitHub repository**
3. **Configure the service:**
   - **Name**: `rewear-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Plan**: `Free`

4. **Add Environment Variables:**
   - `REACT_APP_API_URL` = `https://rewear-web.netlify.app`

5. **Click "Create Static Site"**

### Step 4: Update Backend CORS (if needed)

If you get CORS errors, update your backend environment variable:
- Go to your backend service settings
- Update `CLIENT_URL` to your actual frontend URL

## 🔧 Alternative: One-Click Deployment

If you prefer, you can use the `render.yaml` file I created:

1. **Click "New +"** → **"Blueprint"**
2. **Connect your GitHub repository**
3. **Render will automatically create both services**

## 🌐 Custom Domain (Optional)

1. **Go to your frontend service settings**
2. **Click "Custom Domains"**
3. **Add your domain** (you'll need to configure DNS)

## 📊 Monitoring Your Deployment

- **Build Logs**: Check the "Logs" tab in your Render dashboard
- **Health Check**: Visit `/api/health` on your backend URL
- **Frontend**: Visit your frontend URL

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**: Check the build logs for missing dependencies
2. **CORS Errors**: Verify `CLIENT_URL` environment variable
3. **API Not Found**: Check if backend is running and accessible
4. **Environment Variables**: Make sure all required variables are set

### Debug Commands:

```bash
# Check if backend is running
curl https://rewear-backend.onrender.com/api/health

# Check frontend build
cd client && npm run build
```

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend**: `https://rewear-frontend.onrender.com`
- **Backend API**: `https://rewear-backend.onrender.com`

## 📈 Next Steps

1. **Test all features** on the live site
2. **Set up monitoring** and error tracking
3. **Configure custom domain** (optional)
4. **Set up database** (if needed)

---

**Need help?** Check Render's documentation or contact their support! 