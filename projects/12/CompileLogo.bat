@echo off
md Logo
del /q Logo\*.*
copy ..\09\Logo\*.jack Logo
copy *.jack Logo
call node ..\11\JackCompiler Logo
