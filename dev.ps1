# FocusFlow V2 - Full Dev Environment Start Script

Write-Host "🚀 Starting FocusFlow V2 Development Environment..." -ForegroundColor Cyan

# 1. Start Backend in a new window
Write-Host "Opening Backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "pwsh ./run-backend.ps1"

# 2. Start Frontend in this window
Write-Host "Starting Frontend (Vite)..." -ForegroundColor Yellow
cd frontend
npm run dev
