@echo off
color 0A
title Servidor - Sistema Ganadero
echo ========================================================
echo          INICIANDO EL SISTEMA GANADERO...
echo ========================================================
echo.
echo Por favor, NO CIERRES ESTA VENTANA NEGRA mientras uses el sistema.
echo Para apagar el sistema, simplemente cierra esta ventana.
echo.
echo Iniciando el servidor local. Espera unos segundos...
echo.

cd /d "%~dp0"
call mvnw.cmd spring-boot:run

echo.
echo Ocurrio un problema o el sistema se detuvo.
pause
