    @sum
    M=0
    @10
    D=A
    @n
    M=D

(LOOP)
    @n
    D=M
    @sum
    M=D+M
    @n
    M=M-1
    D=M
    @END
    D;JEQ
    @LOOP
    0;JMP

(END)
    @END
    0;JMP