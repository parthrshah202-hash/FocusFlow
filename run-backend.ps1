# FocusFlow V2 - Backend Start Script

Write-Host "🚀 Starting FocusFlow V2 Backend..." -ForegroundColor Cyan

$BackendDir = "$PSScriptRoot\backend"
$VenvPath = "$BackendDir\venv"

if (-not (Test-Path $VenvPath)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv $VenvPath
}

Write-Host "Installing/Updating dependencies..." -ForegroundColor Yellow
& "$VenvPath\Scripts\pip" install -r "$BackendDir\requirements.txt"

Write-Host "Starting server at http://localhost:8000" -ForegroundColor Green
& "$VenvPath\Scripts\python" "$BackendDir\main.py"
