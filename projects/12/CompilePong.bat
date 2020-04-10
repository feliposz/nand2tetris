@echo off
md Pong
del /q Pong\*.*
copy ..\11\Pong\*.jack Pong
copy *.jack Pong
call ..\..\tools\JackCompiler.bat Pong
