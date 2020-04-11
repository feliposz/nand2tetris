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
del MathTest\Math.vm
call ..\..\tools\JackCompiler.bat Math.jack
if %errorlevel% equ 0 copy Math.vm MathTest
del MemoryTest\Memory.vm
call ..\..\tools\JackCompiler.bat Memory.jack
if %errorlevel% equ 0 copy Memory.vm MemoryTest
del ScreenTest\Screen.vm
call ..\..\tools\JackCompiler.bat Screen.jack
if %errorlevel% equ 0 copy Screen.vm ScreenTest
del StringTest\String.vm
call ..\..\tools\JackCompiler.bat String.jack
if %errorlevel% equ 0 copy String.vm StringTest
del OutputTest\Output.vm
call ..\..\tools\JackCompiler.bat Output.jack
if %errorlevel% equ 0 copy Output.vm OutputTest
del KeyboardTest\Keyboard.vm
call ..\..\tools\JackCompiler.bat Keyboard.jack
if %errorlevel% equ 0 copy Keyboard.vm KeyboardTest
del ArrayTest\Array.vm
call ..\..\tools\JackCompiler.bat Array.jack
if %errorlevel% equ 0 copy Array.vm ArrayTest
del SysTest\Sys.vm
call ..\..\tools\JackCompiler.bat Sys.jack
if %errorlevel% equ 0 copy Sys.vm SysTest
