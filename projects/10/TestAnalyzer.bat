@echo off

echo Apply JackAnalyzer...
node JackAnalyzer ArrayTest
if %errorlevel% neq 0 exit
node JackAnalyzer ExpressionLessSquare
if %errorlevel% neq 0 exit
node JackAnalyzer Square
if %errorlevel% neq 0 exit

echo Compare results:
call ..\..\tools\TextComparer.bat ArrayTest\Main.xml ArrayTest\Main.test.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\Main.xml ExpressionLessSquare\Main.test.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\Square.xml ExpressionLessSquare\Square.test.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\SquareGame.xml ExpressionLessSquare\SquareGame.test.xml
call ..\..\tools\TextComparer.bat Square\Main.xml Square\Main.test.xml
call ..\..\tools\TextComparer.bat Square\Square.xml Square\Square.test.xml
call ..\..\tools\TextComparer.bat Square\SquareGame.xml Square\SquareGame.test.xml
