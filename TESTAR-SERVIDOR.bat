@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   TESTANDO SERVIDOR
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando Python...
python --version
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    pause
    exit /b 1
)
echo.

echo Verificando arquivos...
if not exist "admin-server.py" (
    echo ERRO: admin-server.py nao encontrado!
    pause
    exit /b 1
)
echo OK: admin-server.py encontrado
echo.

echo Verificando porta 8001...
netstat -an | find "8001" >nul
if not errorlevel 1 (
    echo AVISO: Porta 8001 ja esta em uso!
    echo.
    echo Tentando usar porta 8002...
    echo.
)

echo Iniciando servidor...
echo.
echo ========================================
echo   SERVIDOR INICIADO
echo ========================================
echo.
echo Acesse: http://localhost:8001/admin.html
echo.
echo Pressione Ctrl+C para parar
echo.
echo ========================================
echo.

python admin-server.py

pause

