# CraftConnect Backend - Setup & Run Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- Google Cloud Project with:
  - Vertex AI API enabled
  - Cloud Storage bucket created
  - Firestore database initialized
  - Service account with appropriate permissions

---

## 📋 Step-by-Step Setup

### 1. Navigate to Backend Directory
```powershell
cd d:\hack2skill\CraftConnect\backend
```

### 2. Create Virtual Environment (if not exists)
```powershell
# Create virtual environment
python -m venv myvenv

# Activate virtual environment
.\myvenv\Scripts\Activate.ps1
```

If you get execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Install Dependencies
```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Check your `.env` file exists:
```powershell
# View current .env
Get-Content .env
```

Required variables:
```env
PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
GEMINI_MODEL=gemini-1.5-flash
REGION=us-central1
FIRESTORE_DB=(default)
BUCKET_NAME=your-bucket-name
```

### 5. Verify Service Account
```powershell
# Check if service-account.json exists
Test-Path .\service-account.json
```

If missing, download from Google Cloud Console:
1. Go to IAM & Admin > Service Accounts
2. Create or select a service account
3. Click "Keys" tab
4. Create new JSON key
5. Save as `service-account.json` in backend folder

### 6. Run the Backend Server

**Development Mode** (with auto-reload):
```powershell
# Make sure you're in the backend directory
cd d:\hack2skill\CraftConnect\backend

# Activate virtual environment (if not already active)
.\myvenv\Scripts\Activate.ps1

# Run with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production Mode**:
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Alternative - Using Python directly**:
```powershell
python -m uvicorn app.main:app --reload
```

---

## ✅ Verify Backend is Running

### 1. Check Console Output
You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 2. Test Root Endpoint
Open browser or use PowerShell:
```powershell
# Using PowerShell
Invoke-WebRequest -Uri http://localhost:8000 | Select-Object -Expand Content

# Expected response:
# {"message":"CraftConnect API is running"}
```

### 3. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔍 Available Endpoints

### Health Check
- `GET /` - Root endpoint

### Copilot (Image Analysis)
- `POST /copilot/analyze` - Analyze product image with AI

### Storyteller
- `POST /storyteller/generate` - Generate product story

### Pricing
- `POST /pricing/suggest` - Get price suggestions

### Recommendations
- `GET /recs/products/{product_id}/similar` - Get similar products

### Products (NEW)
- `POST /products` - Create product
- `GET /products/{product_id}` - Get product details
- `PUT /products/{product_id}` - Update product
- `DELETE /products/{product_id}` - Delete product
- `GET /products` - List products with filters
- `GET /products/users/{user_id}/stats` - Get user stats

---

## 🧪 Test the Backend

### Using PowerShell

**Test Root Endpoint:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000" -Method Get
```

**Test Product Creation (mock auth):**
```powershell
$headers = @{
    "Authorization" = "Bearer mock-user-123"
    "Content-Type" = "application/json"
}

$body = @{
    title = "Test Ceramic Vase"
    description = "Beautiful handcrafted ceramic vase"
    category = "pottery"
    materials = @("clay", "glaze")
    colors = @("blue", "white")
    tags = @("ceramic", "handmade")
    status = "draft"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/products" -Method Post -Headers $headers -Body $body
```

**Test List Products:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/products?status=public" -Method Get
```

### Using Swagger UI

1. Open http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

---

## 🐛 Common Issues & Solutions

### Issue 1: Virtual Environment Not Activating
```powershell
# Solution: Change execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 2: "Module not found" Error
```powershell
# Solution: Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Issue 3: Google Cloud Authentication Error
```
Error: Could not automatically determine credentials
```

**Solution:**
```powershell
# Set environment variable
$env:GOOGLE_APPLICATION_CREDENTIALS = "d:\hack2skill\CraftConnect\backend\service-account.json"

# Or verify .env file has correct path
```

### Issue 4: Firestore Connection Error
```
Error: Failed to connect to Firestore
```

**Solution:**
1. Verify Firestore is enabled in Google Cloud Console
2. Check service account has Firestore permissions
3. Verify PROJECT_ID in .env is correct

### Issue 5: Port Already in Use
```
ERROR: Address already in use
```

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different port
uvicorn app.main:app --reload --port 8001
```

### Issue 6: CORS Errors from Frontend
**Solution:** Backend already configured with CORS for localhost:3000
If using different port:
```python
# In app/main.py, add your frontend URL
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",  # Add this
    # ...
]
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── config/
│   │   └── settings.py         # Environment config
│   ├── routes/
│   │   ├── copilot.py          # Image analysis
│   │   ├── storyteller.py      # Story generation
│   │   ├── pricing.py          # Pricing suggestions
│   │   ├── recommender.py      # Recommendations
│   │   └── products.py         # Product CRUD (NEW)
│   ├── models/
│   │   ├── product_model.py    # Product service (NEW)
│   │   └── ...
│   ├── schemas/
│   │   ├── product.py          # Product schemas (NEW)
│   │   └── ...
│   └── cloud_services/
│       ├── firestore_db.py     # Firestore client
│       └── ...
├── .env                        # Environment variables
├── service-account.json        # GCP credentials
├── requirements.txt            # Python dependencies
└── myvenv/                     # Virtual environment
```

---

## 🔧 Development Tips

### Auto-Reload
Backend runs with `--reload` flag, so changes to Python files automatically restart the server.

### View Logs
```powershell
# Run with verbose logging
uvicorn app.main:app --reload --log-level debug
```

### Check Running Processes
```powershell
# See if backend is running
Get-Process python
```

### Stop Backend
- Press `CTRL+C` in the terminal
- Or close the PowerShell window

---

## 🌐 Frontend Integration

### Update Frontend .env.local
Already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Test Connection
From frontend:
```javascript
// In frontend code
const response = await fetch('http://localhost:8000/')
const data = await response.json()
console.log(data) // {"message":"CraftConnect API is running"}
```

---

## 📊 Monitoring

### Check Backend Health
```powershell
# Continuous monitoring
while ($true) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000"
        Write-Host "✓ Backend running: $($response.message)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Backend not responding" -ForegroundColor Red
    }
    Start-Sleep -Seconds 5
}
```

### View Active Endpoints
Open http://localhost:8000/docs to see all available endpoints

---

## 🚀 Running Both Frontend & Backend

### Terminal 1 (Backend):
```powershell
cd d:\hack2skill\CraftConnect\backend
.\myvenv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 (Frontend):
```powershell
cd d:\hack2skill\CraftConnect\frontend\public
npm run dev
```

### Access:
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000

---

## 📝 Next Steps

1. ✅ Run backend
2. ✅ Verify endpoints work
3. ✅ Run frontend
4. ✅ Test complete flow:
   - Upload image → AI analysis
   - Create product
   - Edit product
   - View in gallery

---

## 💡 Quick Commands Reference

```powershell
# Activate virtual environment
.\myvenv\Scripts\Activate.ps1

# Run backend
uvicorn app.main:app --reload

# Test root endpoint
Invoke-RestMethod http://localhost:8000

# View docs
start http://localhost:8000/docs

# Stop backend
# Press CTRL+C
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check all dependencies are installed: `pip list`
2. Verify .env file has correct values
3. Ensure service-account.json exists and is valid
4. Check Google Cloud APIs are enabled
5. Review console logs for specific errors

**Common Error Patterns:**
- `ModuleNotFoundError` → Run `pip install -r requirements.txt`
- `Authentication Error` → Check service-account.json
- `Port in use` → Change port or kill process
- `CORS Error` → Verify CORS settings in main.py
