// push constant 0 and pop local 0 inplace
@0
D=A
@SP
AM=M+1
A=A-1
M=D
@LCL
D=M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// label LOOP_START
($LOOP_START)
// push argument 0
@ARG
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// push local 0
@LCL
A=M
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
// pop local 0
@LCL
D=M
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
// push argument 0
@ARG
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// if-goto LOOP_START
@SP
AM=M-1
D=M
@$LOOP_START
D;JNE
// push local 0
@LCL
A=M
D=M
@SP
AM=M+1
A=A-1
M=D