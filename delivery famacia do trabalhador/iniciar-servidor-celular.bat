@echo off
title Servidor Delivery - Farmacia do Trabalhador
echo ========================================================
echo    INICIANDO SERVIDOR DO DELIVERY NO CELULAR
echo ========================================================
cd /d "%~dp0"
node server.js
pause
