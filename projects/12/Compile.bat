@echo off

rem call ..\..\tools\JackCompiler.bat ArrayTest
rem call ..\..\tools\JackCompiler.bat KeyboardTest
rem call ..\..\tools\JackCompiler.bat MathTest
rem call ..\..\tools\JackCompiler.bat MemoryTest
rem call ..\..\tools\JackCompiler.bat OutputTest
rem call ..\..\tools\JackCompiler.bat ScreenTest
rem call ..\..\tools\JackCompiler.bat StringTest
rem call ..\..\tools\JackCompiler.bat SysTest

call ..\..\tools\JackCompiler.bat Math.jack
if %errorlevel% equ 0 copy Math.vm MathTest
