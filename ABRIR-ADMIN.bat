@echo off
chcp 65001 >nul
title Painel Admin - Dra. Nadia
color 0A

echo.
echo ========================================
echo    PAINEL ADMINISTRATIVO
echo    Site Dra. Nadia
echo ========================================
echo.

REM Mudar para a pasta do script
cd /d "%~dp0"

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] Python nao encontrado!
    echo.
    echo Instale o Python em: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [OK] Python encontrado
echo.

REM Verificar arquivo
if not exist "admin-server.py" (
    echo [X] Arquivo admin-server.py nao encontrado!
    echo.
    echo Certifique-se de estar na pasta correta.
    echo.
    pause
    exit /b 1
)

echo [OK] Iniciando servidor...
echo.
echo ========================================
echo    O navegador abrira automaticamente
echo ========================================
echo.
echo Aguarde alguns segundos...
echo.

python admin-server.py

pause

