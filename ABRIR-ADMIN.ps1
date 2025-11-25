# Script PowerShell - Abrir Painel Admin Automaticamente
$host.UI.RawUI.WindowTitle = "Painel Admin - Dra. Nadia"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PAINEL ADMINISTRATIVO" -ForegroundColor Cyan
Write-Host "   Site Dra. Nadia" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Mudar para a pasta do script
Set-Location $PSScriptRoot

# Verificar Python
try {
    $null = python --version 2>&1
    Write-Host "[OK] Python encontrado" -ForegroundColor Green
} catch {
    Write-Host "[X] Python nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale o Python em: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Verificar arquivo
if (-not (Test-Path "admin-server.py")) {
    Write-Host "[X] Arquivo admin-server.py nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Certifique-se de estar na pasta correta." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "[OK] Iniciando servidor..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   O navegador abrira automaticamente" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Aguarde alguns segundos..." -ForegroundColor Yellow
Write-Host ""

try {
    python admin-server.py
} catch {
    Write-Host ""
    Write-Host "[ERRO] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione Enter para sair"
}

