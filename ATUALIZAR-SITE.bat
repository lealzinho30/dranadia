@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   ATUALIZANDO SITE
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    pause
    exit /b 1
)

echo [OK] Python encontrado
echo.

echo Executando atualizacao...
echo.

python atualizar_site.py

echo.
echo ========================================
echo   CONCLUIDO
echo ========================================
echo.
echo Recarregue o site no navegador (Ctrl+F5)
echo para ver as mudancas!
echo.

pause

