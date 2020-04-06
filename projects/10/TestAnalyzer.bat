@echo off

echo Apply JackAnalyzer...
node JackAnalyzer ArrayTest
if %errorlevel% neq 0 exit
node JackAnalyzer ExpressionLessSquare
if %errorlevel% neq 0 exit
node JackAnalyzer Square
if %errorlevel% neq 0 exit

echo Comparing ArrayTest\Main.xml
call ..\..\tools\TextComparer.bat ArrayTest\Main.xml ArrayTest\Main.test.xml
echo Comparing ExpressionLessSquare\Main.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\Main.xml ExpressionLessSquare\Main.test.xml
echo Comparing ExpressionLessSquare\Square.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\Square.xml ExpressionLessSquare\Square.test.xml
echo Comparing ExpressionLessSquare\SquareGame.xml
call ..\..\tools\TextComparer.bat ExpressionLessSquare\SquareGame.xml ExpressionLessSquare\SquareGame.test.xml
echo Comparing Square\Main.xml
call ..\..\tools\TextComparer.bat Square\Main.xml Square\Main.test.xml
echo Comparing Square\Square.xml
call ..\..\tools\TextComparer.bat Square\Square.xml Square\Square.test.xml
echo Comparing Square\SquareGame.xml
call ..\..\tools\TextComparer.bat Square\SquareGame.xml Square\SquareGame.test.xml
