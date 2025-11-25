@echo off
chcp 65001 >nul
echo ========================================
echo   INICIANDO SERVIDOR ADMIN
echo ========================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python não encontrado!
    echo.
    echo Por favor, instale o Python em: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [OK] Python encontrado
python --version
echo.

REM Verificar se o arquivo admin-server.py existe
if not exist "admin-server.py" (
    echo [ERRO] Arquivo admin-server.py não encontrado!
    echo.
    echo Certifique-se de estar na pasta correta do projeto.
    echo.
    pause
    exit /b 1
)

echo [OK] Arquivo admin-server.py encontrado
echo.
echo Iniciando servidor na porta 8001...
echo.
echo ========================================
echo   SERVIDOR INICIADO
echo ========================================
echo.
echo Acesse: http://localhost:8001/admin.html
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.

python admin-server.py

if errorlevel 1 (
    echo.
    echo [ERRO] O servidor foi encerrado com erro!
    echo.
    pause
)


