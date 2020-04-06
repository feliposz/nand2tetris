@echo off

echo Apply TestTokenizer...
node TestTokenizer ArrayTest\Main.jack
if %errorlevel% neq 0 exit
node TestTokenizer ExpressionLessSquare\Main.jack
if %errorlevel% neq 0 exit
node TestTokenizer ExpressionLessSquare\Square.jack
if %errorlevel% neq 0 exit
node TestTokenizer ExpressionLessSquare\SquareGame.jack
if %errorlevel% neq 0 exit
node TestTokenizer Square\Main.jack
if %errorlevel% neq 0 exit
node TestTokenizer Square\Square.jack
if %errorlevel% neq 0 exit
node TestTokenizer Square\SquareGame.jack
if %errorlevel% neq 0 exit

echo Compare results:
call ..\..\tools\TextComparer.bat ArrayTest\MainT.xml ArrayTest\MainT.test.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\MainT.xml ExpressionLessSquare\MainT.test.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\SquareT.xml ExpressionLessSquare\SquareT.test.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\SquareGameT.xml ExpressionLessSquare\SquareGameT.test.xml
call ..\..\tools\TextComparer.bat Square\MainT.xml Square\MainT.test.xml
call ..\..\tools\TextComparer.bat Square\SquareT.xml Square\SquareT.test.xml
call ..\..\tools\TextComparer.bat Square\SquareGameT.xml Square\SquareGameT.test.xml
