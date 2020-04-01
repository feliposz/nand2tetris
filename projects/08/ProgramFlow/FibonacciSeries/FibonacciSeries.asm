// push argument 1 and pop pointer 1 inplace
@ARG
A=M+1
D=M
@THAT
M=D
// push constant 0 and pop that 0 inplace
@0
D=A
@SP
AM=M+1
A=A-1
M=D
@THAT
D=M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// push constant 1 and pop that 1 inplace
@1
D=A
@SP
AM=M+1
A=A-1
M=D
@THAT
D=M+1
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// push argument 0
@ARG
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// push constant 2
@2
D=A
@SP
AM=M+1
A=A-1
M=D
// sub
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D
// pop argument 0
@ARG
D=M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// label MAIN_LOOP_START
($MAIN_LOOP_START)
// push argument 0
@ARG
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// if-goto COMPUTE_ELEMENT
@SP
AM=M-1
D=M
@$COMPUTE_ELEMENT
D;JNE
// goto END_PROGRAM
@$END_PROGRAM
0;JMP
// label COMPUTE_ELEMENT
($COMPUTE_ELEMENT)
// push that 0
@THAT
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// push that 1
@THAT
A=M+1
D=M
@SP
AM=M+1
A=A-1
M=D
// add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M
// pop that 2
@2
D=A
@THAT
D=D+M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// push pointer 1
@THAT
D=M
@SP
AM=M+1
A=A-1
M=D
// push constant 1
@1
D=A
@SP
AM=M+1
A=A-1
M=D
// add
@SP
AM=M-1
D=M
@SP
A=M-1
M=D+M
// pop pointer 1
@SP
AM=M-1
D=M
@THAT
M=D
// push argument 0
@ARG
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// push constant 1
@1
D=A
@SP
AM=M+1
A=A-1
M=D
// sub
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D
// pop argument 0
@ARG
D=M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// goto MAIN_LOOP_START
@$MAIN_LOOP_START
0;JMP
// label END_PROGRAM
($END_PROGRAM)