# Backend-Frontend Connection Testing Guide

## Quick Connection Test

### Test 1: Backend Health Check
```powershell
# Simple test to see if backend is running
Invoke-RestMethod -Uri "http://localhost:8000/"
```
**Expected:** `{"message": "CraftConnect AI API is running"}`

### Test 2: CORS Test (from browser console)
```javascript
// Open browser console (F12) on http://localhost:3000
fetch('http://localhost:8000/')
  .then(r => r.json())
  .then(d => console.log('Backend connected:', d))
  .catch(e => console.error('Connection failed:', e))
```

### Test 3: Register a User (PowerShell)
```powershell
$body = @{
    email = "testuser@example.com"
    password = "Test123456"
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "Token: $($response.access_token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "User ID: $($response.user.user_id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Registration failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}
```

### Test 4: Full Frontend Test
1. Open http://localhost:3000/register in browser
2. Open browser DevTools (F12) → Console tab
3. Register with:
   - Email: demo@test.com
   - Password: Demo123456
   - Name: Demo User
4. Watch for:
   - ✅ Network request to `http://localhost:8000/auth/register`
   - ✅ Response with token
   - ✅ Redirect to dashboard
   - ✅ Token saved in localStorage

## Common Issues & Fixes

### Issue: "Failed to fetch" or CORS errors
**Fix:** Restart backend server
```powershell
# Kill and restart
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Issue: No response from backend
**Check:** Is backend actually running?
```powershell
netstat -ano | findstr :8000
```

### Issue: 401 Unauthorized
**Fix:** Token expired or invalid - logout and login again

### Issue: Dashboard buttons don't work
**Status:** ✅ FIXED - all tool cards now navigate properly

### Issue: Authentication doesn't persist
**Check:** Browser localStorage
```javascript
// In browser console
console.log('Token:', localStorage.getItem('auth_token'))
console.log('User:', localStorage.getItem('user_data'))
```

## What Should Work Now

✅ Dashboard tool cards navigate to correct pages
✅ Login/Register pages functional
✅ Authentication persists in localStorage
✅ API automatically includes auth token
✅ Product search, like functionality
✅ All backend endpoints accessible

## Debug Checklist

- [ ] Backend running on port 8000?
- [ ] Frontend running on port 3000?
- [ ] Can access http://localhost:8000/docs?
- [ ] Browser console shows no errors?
- [ ] Network tab shows requests to backend?
- [ ] Tokens being sent in Authorization header?

---

**Need Help?** Check browser console for specific error messages!
