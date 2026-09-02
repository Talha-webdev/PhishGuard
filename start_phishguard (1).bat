@echo off
title PhishGuard Backend
cd /d "%~dp0"

echo Activating conda base environment...
call C:\Users\ok\anaconda3\Scripts\activate.bat base

echo Starting PhishGuard backend...
uvicorn backend.main:app --host 127.0.0.1 --port 8000

pause
