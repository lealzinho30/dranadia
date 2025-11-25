# Script PowerShell para iniciar o servidor admin
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SERVIDOR ADMIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Python não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o Python em: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Verificar se o arquivo existe
if (-not (Test-Path "admin-server.py")) {
    Write-Host "[ERRO] Arquivo admin-server.py não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Certifique-se de estar na pasta correta do projeto." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "[OK] Arquivo admin-server.py encontrado" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando servidor na porta 8001..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SERVIDOR INICIADO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Acesse: http://localhost:8001/admin.html" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    python admin-server.py
} catch {
    Write-Host ""
    Write-Host "[ERRO] O servidor foi encerrado com erro!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione Enter para sair"
}

