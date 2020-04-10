@echo off

echo.
echo Compiling tests
echo ===============
call ..\..\tools\JackCompiler.bat ArrayTest
call ..\..\tools\JackCompiler.bat KeyboardTest
call ..\..\tools\JackCompiler.bat MathTest
call ..\..\tools\JackCompiler.bat MemoryTest
call ..\..\tools\JackCompiler.bat OutputTest
call ..\..\tools\JackCompiler.bat ScreenTest
call ..\..\tools\JackCompiler.bat StringTest
call ..\..\tools\JackCompiler.bat SysTest

echo.
echo Compiling implementations
echo =========================
call ..\..\tools\JackCompiler.bat Math.jack
if %errorlevel% equ 0 copy Math.vm MathTest

call ..\..\tools\JackCompiler.bat Memory.jack
if %errorlevel% equ 0 copy Memory.vm MemoryTest

call ..\..\tools\JackCompiler.bat Screen.jack
if %errorlevel% equ 0 copy Screen.vm ScreenTest

call ..\..\tools\JackCompiler.bat String.jack
if %errorlevel% equ 0 copy String.vm StringTest

call ..\..\tools\JackCompiler.bat Output.jack
if %errorlevel% equ 0 copy Output.vm OutputTest

call ..\..\tools\JackCompiler.bat Keyboard.jack
if %errorlevel% equ 0 copy Keyboard.vm KeyboardTest

call ..\..\tools\JackCompiler.bat Array.jack
if %errorlevel% equ 0 copy Array.vm ArrayTest

call ..\..\tools\JackCompiler.bat Sys.jack
if %errorlevel% equ 0 copy Sys.vm SysTest
