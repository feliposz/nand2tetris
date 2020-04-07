@echo off

echo Compiling all tests
node JackCompiler Seven
if %errorlevel% neq 0 exit
node JackCompiler ConvertToBin
if %errorlevel% neq 0 exit
node JackCompiler Square
if %errorlevel% neq 0 exit
node JackCompiler Average
if %errorlevel% neq 0 exit
node JackCompiler Pong
if %errorlevel% neq 0 exit
node JackCompiler ComplexArrays
if %errorlevel% neq 0 exit
