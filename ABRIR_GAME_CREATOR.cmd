@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Preparando Game Creator v4.0 com Pixel Art integrado...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0integracao\build_unificado.ps1"
if errorlevel 1 (
 echo.
 echo Nao foi possivel montar o editor integrado. O arquivo v4.0 original nao foi alterado.
 echo Confira as pastas pixel-art, map-editor e integracao.
 pause
 exit /b 1
)
start "" "%~dp0index.html"
