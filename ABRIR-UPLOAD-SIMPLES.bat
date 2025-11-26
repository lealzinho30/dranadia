@echo off
chcp 65001 >nul
cls
title Upload de Fotos - Sistema Simples

echo.
echo ========================================
echo   SISTEMA DE UPLOAD DE FOTOS
echo ========================================
echo.

REM Verificar se o servidor está rodando
netstat -an | find "8001" | find "LISTENING" >nul
if errorlevel 1 (
    echo [AVISO] Servidor não está rodando!
    echo.
    echo Iniciando servidor...
    echo.
    start "Admin Server" python admin-server.py
    timeout /t 3 /nobreak >nul
    echo.
)

echo Abrindo sistema de upload...
echo.
start http://localhost:8001/upload-simples.html

echo.
echo ========================================
echo   Sistema aberto no navegador!
echo ========================================
echo.
echo Se não abrir, acesse:
echo http://localhost:8001/upload-simples.html
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

