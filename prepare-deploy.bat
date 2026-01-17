@echo off
echo Preparing deploy folder for Vue Lessons...
echo.

if exist deploy rmdir /s /q deploy
mkdir deploy

copy /Y index.html deploy\ >nul
xcopy /E /I /Y lessons deploy\lessons >nul
mkdir deploy\ecommerce 2>nul
copy /Y ecommerce\index.html ecommerce\account.html ecommerce\auth.html ecommerce\cart.html ecommerce\checkout.html ecommerce\products.html ecommerce\search.html ecommerce\address-form.html deploy\ecommerce\ >nul
xcopy /E /I /Y ecommerce\assets deploy\ecommerce\assets >nul

echo.
echo [OK] Deploy folder ready: .\deploy
echo.
echo Contents: index.html, lessons\ (all 26 lessons), ecommerce\
echo.
echo Next: Go to https://app.netlify.com
echo       "Add new site" -^> "Deploy manually"
echo       Drag the DEPLOY folder into the drop zone
echo.
echo See DEPLOYMENT.md for full instructions.
echo.
pause
