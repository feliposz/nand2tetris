// initialize array arr of size n to -1
// n is R0
// arr is pointed by R1

    @R0
    D=M
    @n
    M=D // n = R0

    @R1
    D=M
    @arr
    M=D // arr = R1

    @i
    M=0 // i = 0

(LOOP)
    @i
    D=M
    @n
    D=D-M
    @END
    D;JEQ // i == n

    @arr
    D=M
    @i
    A=D+M
    M=-1 // arr[i] = -1

    @i
    M=M+1 // i++

    @LOOP
    0;JMP

    @END
(END)
    0;JMP
