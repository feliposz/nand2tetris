@256
D=A
@SP
M=D
@5
D=A
@R13
M=D
@Sys.init
D=A
@R14
M=D
@Sys.init$ret0
D=A
@VM$CALL
0;JMP
(Sys.init$ret0)
(VM$STOP)
@VM$STOP
0;JMP
(VM$CALL)
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
@R13
D=M
@SP
D=M-D
@ARG
M=D
@R14
A=M
0;JMP
(VM$RETURN)
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
// function Class1.set 0
(Class1.set)
@SP
D=M
@LCL
M=D
// push argument 0 and pop static 0 inplace
@ARG
A=M
D=M
@Class1.0
M=D
// push argument 1 and pop static 1 inplace
@ARG
A=M+1
D=M
@Class1.1
M=D
// push constant 0
@0
D=A
@SP
AM=M+1
A=A-1
M=D
// return
@VM$RETURN
0;JMP
// function Class1.get 0
(Class1.get)
@SP
D=M
@LCL
M=D
// push static 0
@Class1.0
D=M
@SP
AM=M+1
A=A-1
M=D
// push static 1
@Class1.1
D=M
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
// return
@VM$RETURN
0;JMP
// function Class2.set 0
(Class2.set)
@SP
D=M
@LCL
M=D
// push argument 0 and pop static 0 inplace
@ARG
A=M
D=M
@Class2.0
M=D
// push argument 1 and pop static 1 inplace
@ARG
A=M+1
D=M
@Class2.1
M=D
// push constant 0
@0
D=A
@SP
AM=M+1
A=A-1
M=D
// return
@VM$RETURN
0;JMP
// function Class2.get 0
(Class2.get)
@SP
D=M
@LCL
M=D
// push static 0
@Class2.0
D=M
@SP
AM=M+1
A=A-1
M=D
// push static 1
@Class2.1
D=M
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
// return
@VM$RETURN
0;JMP
// function Sys.init 0
(Sys.init)
@SP
D=M
@LCL
M=D
// push constant 6
@6
D=A
@SP
AM=M+1
A=A-1
M=D
// push constant 8
@8
D=A
@SP
AM=M+1
A=A-1
M=D
// call Class1.set 2
@7
D=A
@R13
M=D
@Class1.set
D=A
@R14
M=D
@Class1.set$ret1
D=A
@VM$CALL
0;JMP
(Class1.set$ret1)
// pop temp 0
@SP
AM=M-1
D=M
@5
M=D
// push constant 23
@23
D=A
@SP
AM=M+1
A=A-1
M=D
// push constant 15
@15
D=A
@SP
AM=M+1
A=A-1
M=D
// call Class2.set 2
@7
D=A
@R13
M=D
@Class2.set
D=A
@R14
M=D
@Class2.set$ret2
D=A
@VM$CALL
0;JMP
(Class2.set$ret2)
// pop temp 0
@SP
AM=M-1
D=M
@5
M=D
// call Class1.get 0
@5
D=A
@R13
M=D
@Class1.get
D=A
@R14
M=D
@Class1.get$ret3
D=A
@VM$CALL
0;JMP
(Class1.get$ret3)
// call Class2.get 0
@5
D=A
@R13
M=D
@Class2.get
D=A
@R14
M=D
@Class2.get$ret4
D=A
@VM$CALL
0;JMP
(Class2.get$ret4)
// label WHILE
(Sys.init$WHILE)
// goto WHILE
@Sys.init$WHILE
0;JMP