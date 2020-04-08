@echo off

rem call ..\..\tools\JackCompiler.bat ArrayTest
rem call ..\..\tools\JackCompiler.bat KeyboardTest
rem call ..\..\tools\JackCompiler.bat MathTest
call ..\..\tools\JackCompiler.bat MemoryTest
rem call ..\..\tools\JackCompiler.bat OutputTest
rem call ..\..\tools\JackCompiler.bat ScreenTest
rem call ..\..\tools\JackCompiler.bat StringTest
rem call ..\..\tools\JackCompiler.bat SysTest

rem call ..\..\tools\JackCompiler.bat Math.jack
rem if %errorlevel% equ 0 copy Math.vm MathTest

call ..\..\tools\JackCompiler.bat Memory.jack
if %errorlevel% equ 0 copy Memory.vm MemoryTest
