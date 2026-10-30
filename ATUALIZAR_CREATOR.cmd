@echo off
setlocal
cd /d "%~dp0"
echo.
echo ================================================
echo  APOENA GAME CREATOR - INSTALAR / ATUALIZAR
echo ================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0integracao\atualizar-creator.ps1" %*
set "RESULTADO=%ERRORLEVEL%"
echo.
if not "%RESULTADO%"=="0" (
  echo A atualizacao nao foi concluida. Leia o erro acima.
  echo Seus arquivos pessoais e o runner nao foram apagados.
) else (
  echo Para testar, abra ABRIR_GAME_CREATOR.cmd na pasta instalada.
)
echo.
pause
exit /b %RESULTADO%
