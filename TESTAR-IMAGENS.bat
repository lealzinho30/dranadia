@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   TESTANDO CARREGAMENTO DE IMAGENS
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando arquivo de imagem...
if exist "images\2025-11-21 (1)-editado.webp" (
    echo [OK] Arquivo encontrado: images\2025-11-21 (1)-editado.webp
) else (
    echo [ERRO] Arquivo nao encontrado!
    echo.
    echo Arquivos na pasta images:
    dir /b images\*.webp
    echo.
    pause
    exit /b 1
)

echo.
echo Verificando config.json...
findstr /C:"2025-11-21 (1)-editado.webp" config.json >nul
if errorlevel 1 (
    echo [AVISO] Imagem nao encontrada no config.json
) else (
    echo [OK] Imagem configurada no config.json
)

echo.
echo ========================================
echo   TESTE CONCLUIDO
echo ========================================
echo.
echo Se o servidor estiver rodando, acesse:
echo http://localhost:8001/images/2025-11-21 (1)-editado.webp
echo.
pause

