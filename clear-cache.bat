@echo off
echo Clearing all React Native caches...

echo.
echo [1/5] Clearing Metro bundler cache...
npx react-native start --reset-cache --host 192.168.29.173 &
timeout /t 2 /nobreak >nul
taskkill /F /IM node.exe /T 2>nul

echo.
echo [2/5] Clearing watchman cache (if installed)...
watchman watch-del-all 2>nul || echo Watchman not installed, skipping...

echo.
echo [3/5] Clearing npm cache...
npm cache clean --force

echo.
echo [4/5] Clearing Android build cache...
cd android
if exist gradlew.bat (
    call gradlew.bat clean
) else (
    echo Gradle wrapper not found, skipping...
)
cd ..

echo.
echo [5/5] Clearing React Native temp files...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .metro rmdir /s /q .metro 2>nul
if exist $TMPDIR\react-* rmdir /s /q $TMPDIR\react-* 2>nul

echo.
echo ========================================
echo Cache clearing complete!
echo ========================================
echo.
echo Now run: npm run start:reset
echo Or: npm run android (to rebuild app)
echo.

