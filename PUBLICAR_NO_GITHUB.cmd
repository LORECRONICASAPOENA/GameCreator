@echo off
chcp 65001 >nul
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0PUBLICAR_NO_GITHUB.ps1"
if errorlevel 1 (
 echo.
 echo Falha na publicacao. Veja a mensagem acima.
) else (
 echo.
 echo Processo concluido.
)
echo.
pause
