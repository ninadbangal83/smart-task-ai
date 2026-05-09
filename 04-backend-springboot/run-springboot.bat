@echo off
SETLOCAL EnableDelayedExpansion
title Launching SmartTask AI - SpringBoot Server (3003)

echo =============================================================
echo ☕ SmartTask AI - SpringBoot Auto-Launcher (Zero-Config)
echo =============================================================

:: Check if Java is installed
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: Java is not installed or not in your PATH.
    echo Please install Java 17 or higher to continue.
    pause
    exit /b 1
)

:: Define local maven directory
set "MAVEN_DIR=%~dp0.maven-local"
set "MAVEN_ZIP=%~dp0maven.zip"
set "MVN_BIN=%MAVEN_DIR%\apache-maven-3.9.6\bin\mvn.cmd"

:: Download and extract Maven if not present locally
if not exist "%MVN_BIN%" (
    echo 📥 Local Maven not found. Downloading Apache Maven 3.9.6...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile '%MAVEN_ZIP%'"
    
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to download Maven. Please check your internet connection.
        pause
        exit /b 1
    )
    
    echo 📦 Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_DIR%' -Force"
    del "%MAVEN_ZIP%"
    echo ✅ Local Maven setup completed successfully!
)

echo 🚀 Starting Spring Boot Dev Server on Port 3003...
echo Please wait, Maven is resolving dependencies and compiling your server...
echo -------------------------------------------------------------

:: Run Spring Boot using local Maven
call "%MVN_BIN%" spring-boot:run

pause
