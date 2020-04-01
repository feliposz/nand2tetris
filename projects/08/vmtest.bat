@echo off
echo ====================
echo Applying translation
echo ====================

node vmtranslator ProgramFlow\BasicLoop\BasicLoop.vm n
node vmtranslator ProgramFlow\FibonacciSeries\FibonacciSeries.vm n
node vmtranslator FunctionCalls\SimpleFunction\SimpleFunction.vm n
node vmtranslator FunctionCalls\NestedCall
node vmtranslator FunctionCalls\FibonacciElement
node vmtranslator FunctionCalls\StaticsTest
echo ==============
echo Applying tests
echo ==============
echo Testing: BasicLoop
call ..\..\tools\CPUEmulator.bat ProgramFlow\BasicLoop\BasicLoop.tst
echo Testing: FibonacciSeries
call ..\..\tools\CPUEmulator.bat ProgramFlow\FibonacciSeries\FibonacciSeries.tst
echo Testing: SimpleFunction
call ..\..\tools\CPUEmulator.bat FunctionCalls\SimpleFunction\SimpleFunction.tst
echo Testing: NestedCall
call ..\..\tools\CPUEmulator.bat FunctionCalls\NestedCall\NestedCall.tst
echo Testing: FibonacciElement
call ..\..\tools\CPUEmulator.bat FunctionCalls\FibonacciElement\FibonacciElement.tst
echo Testing: StaticsTest
call ..\..\tools\CPUEmulator.bat FunctionCalls\StaticsTest\StaticsTest.tst
