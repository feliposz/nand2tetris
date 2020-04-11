@echo off
md Logo
del /q Logo\*.*
copy ..\09\Logo\*.jack Logo
copy *.jack Logo
rem call ..\..\tools\JackCompiler.bat Logo
call node ..\11\JackCompiler Logo
rem call node ..\08\vmtranslator Logo
