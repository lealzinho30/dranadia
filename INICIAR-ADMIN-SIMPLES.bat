@echo off
chcp 65001 >nul
cls
title Painel Admin - Iniciando...

echo.
echo ========================================
echo   INICIANDO PAINEL ADMINISTRATIVO
echo ========================================
echo.

REM Ir para pasta do script
cd /d "%~dp0"

REM Verificar Python
echo [1/4] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERRO] Python nao encontrado!
    echo.
    echo Por favor, instale o Python:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANTE: Marque "Add Python to PATH" na instalacao!
    echo.
    pause
    exit /b 1
)
python --version
echo [OK] Python encontrado
echo.

REM Verificar arquivo
echo [2/4] Verificando arquivos...
if not exist "admin-server.py" (
    echo [ERRO] Arquivo admin-server.py nao encontrado!
    echo.
    echo Certifique-se de estar na pasta correta do projeto.
    echo.
    pause
    exit /b 1
)
echo [OK] Arquivos encontrados
echo.

REM Verificar porta
echo [3/4] Verificando porta 8001...
netstat -an | find "8001" | find "LISTENING" >nul
if not errorlevel 1 (
    echo [AVISO] Porta 8001 ja esta em uso!
    echo.
    echo Tentando continuar mesmo assim...
    echo.
) else (
    echo [OK] Porta 8001 disponivel
)
echo.

REM Iniciar servidor
echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo   SERVIDOR INICIADO COM SUCESSO!
echo ========================================
echo.
echo O navegador vai abrir automaticamente em alguns segundos...
echo.
echo Se nao abrir, acesse manualmente:
echo http://localhost:8001/admin.html
echo.
echo ========================================
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

python admin-server.py

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERRO AO INICIAR SERVIDOR
    echo ========================================
    echo.
    echo Possiveis causas:
    echo 1. Porta 8001 ja esta em uso
    echo 2. Firewall bloqueando
    echo 3. Permissoes insuficientes
    echo.
    echo Tente:
    echo - Fechar outros programas
    echo - Executar como Administrador
    echo - Reiniciar o computador
    echo.
)

pause

