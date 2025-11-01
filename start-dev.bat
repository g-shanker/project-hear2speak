@echo off
REM ----------------------------------------
REM One-click dev environment for Quarkus + Angular
REM Opens Windows Terminal with two tabs:
REM   1) Quarkus backend
REM   2) Angular frontend
REM ----------------------------------------

REM Save current directory
SET ROOT_DIR=%CD%

REM Launch Windows Terminal
wt ^
    new-tab -p "PowerShell" -d "%ROOT_DIR%\backend" cmd /k ".\mvnw quarkus:dev" ^
    ; new-tab -p "PowerShell" -d "%ROOT_DIR%\frontend" cmd /k "ng serve --proxy-config proxy.conf.json"
