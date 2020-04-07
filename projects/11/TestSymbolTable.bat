@echo off

echo Generate syntax tree with symbol table info
node JackCompiler Seven -s
if %errorlevel% neq 0 exit
node JackCompiler ConvertToBin -s
if %errorlevel% neq 0 exit
node JackCompiler Square -s
if %errorlevel% neq 0 exit
node JackCompiler Average -s
if %errorlevel% neq 0 exit
node JackCompiler Pong -s
if %errorlevel% neq 0 exit
node JackCompiler ComplexArrays -s
if %errorlevel% neq 0 exit
