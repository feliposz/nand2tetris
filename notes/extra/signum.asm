// If R0>0 Then R1=1 Else R1=0

    @R0
    D=M

    @POSITIVE
    D;JGT

    @R1
    M=0
    @END
    0;JMP

(POSITIVE)
    @1
    M=1

(END)
    @END
    0;JMP