// function Sys.init 0
(Sys.init)
@SP
D=M
@LCL
M=D
// push constant 4000
@4000
D=A
@SP
AM=M+1
A=A-1
M=D
// pop pointer 0
@SP
AM=M-1
D=M
@THIS
M=D
// push constant 5000
@5000
D=A
@SP
AM=M+1
A=A-1
M=D
// pop pointer 1
@SP
AM=M-1
D=M
@THAT
M=D
// call Sys.main 0
@Sys.main$ret0
D=A
@SP
AM=M+1
A=A-1
M=D
@LCL
D=M
@SP
AM=M+1
A=A-1
M=D
@ARG
D=M
@SP
AM=M+1
A=A-1
M=D
@THIS
D=M
@SP
AM=M+1
A=A-1
M=D
@THAT
D=M
@SP
AM=M+1
A=A-1
M=D
@5
D=A
@SP
D=M-D
@ARG
M=D
@Sys.main
0;JMP
(Sys.main$ret0)
// pop temp 1
@SP
AM=M-1
D=M
@6
M=D
// label LOOP
(Sys.init$LOOP)
// goto LOOP
@Sys.init$LOOP
0;JMP
// function Sys.main 5
(Sys.main)
@SP
D=M
@LCL
M=D
@SP
AM=M+1
A=A-1
M=0
@SP
AM=M+1
A=A-1
M=0
@SP
AM=M+1
A=A-1
M=0
@SP
AM=M+1
A=A-1
M=0
@SP
AM=M+1
A=A-1
M=0
// push constant 4001
@4001
D=A
@SP
AM=M+1
A=A-1
M=D
// pop pointer 0
@SP
AM=M-1
D=M
@THIS
M=D
// push constant 5001
@5001
D=A
@SP
AM=M+1
A=A-1
M=D
// pop pointer 1
@SP
AM=M-1
D=M
@THAT
M=D
// push constant 200
@200
D=A
@SP
AM=M+1
A=A-1
M=D
// pop local 1
@LCL
D=M+1
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// push constant 40
@40
D=A
@SP
AM=M+1
A=A-1
M=D
// pop local 2
@2
D=A
@LCL
D=D+M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// push constant 6
@6
D=A
@SP
AM=M+1
A=A-1
M=D
// pop local 3
@3
D=A
@LCL
D=D+M
@R13
M=D
@SP
AM=M-1
D=M
@R13
A=M
M=D
// push constant 123
@123
D=A
@SP
AM=M+1
A=A-1
M=D
// call Sys.add12 1
@Sys.add12$ret1
D=A
@SP
AM=M+1
A=A-1
M=D
@LCL
D=M
@SP
AM=M+1
A=A-1
M=D
@ARG
D=M
@SP
AM=M+1
A=A-1
M=D
@THIS
D=M
@SP
AM=M+1
A=A-1
M=D
@THAT
D=M
@SP
AM=M+1
A=A-1
M=D
@6
D=A
@SP
D=M-D
@ARG
M=D
@Sys.add12
0;JMP
(Sys.add12$ret1)
// pop temp 0
@SP
AM=M-1
D=M
@5
M=D
// push local 0
@LCL
A=M
D=M
@SP
AM=M+1
A=A-1
M=D
// push local 1
@LCL
A=M+1
D=M
@SP
AM=M+1
A=A-1
M=D
// push local 2
@2
D=A
@LCL
A=D+M
D=M
@SP
AM=M+1
A=A-1
M=D
// push local 3
@3
D=A
@LCL
A=D+M
D=M
@SP
AM=M+1
A=A-1
M=D
// push local 4
@4
D=A
@LCL
A=D+M
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
D=D+M
M=D
// add
@SP
AM=M-1
D=M
@SP
A=M-1
D=D+M
M=D
// add
@SP
AM=M-1
D=M
@SP
A=M-1
D=D+M
M=D
// add
@SP
AM=M-1
D=M
@SP
A=M-1
D=D+M
M=D
// return
@5
D=A
@LCL
A=M-D
D=M
@R13
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
D=A
@SP
M=D+1
@LCL
D=M
@R14
AM=D-1
D=M
@THAT
M=D
@R14
AM=M-1
D=M
@THIS
M=D
@R14
AM=M-1
D=M
@ARG
M=D
@R14
AM=M-1
D=M
@LCL
M=D
@R13
A=M
0;JMP
// function Sys.add12 0
(Sys.add12)
@SP
D=M
@LCL
M=D
// push constant 4002
@4002
D=A
@SP
AM=M+1
A=A-1
M=D
// pop pointer 0
@SP
AM=M-1
D=M
@THIS
M=D
// push constant 5002
@5002
D=A
@SP
AM=M+1
A=A-1
M=D
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
// push constant 12
@12
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
D=D+M
M=D
// return
@5
D=A
@LCL
A=M-D
D=M
@R13
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
D=A
@SP
M=D+1
@LCL
D=M
@R14
AM=D-1
D=M
@THAT
M=D
@R14
AM=M-1
D=M
@THIS
M=D
@R14
AM=M-1
D=M
@ARG
M=D
@R14
AM=M-1
D=M
@LCL
M=D
@R13
A=M
0;JMP