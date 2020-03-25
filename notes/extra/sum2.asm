// Sum 1 to N
// N = RAM[0]
// SUM = RAM[1]
// Computes RAM[1] = 1+2+...+RAM[0]
    
    @R0
    D=M
    @n
    M=D // n = RAM[0]

    @i
    M=1 // i = 1

    @sum
    M=0 // sum = 0

(LOOP)
    @i
    D=M
    @n
    D=D-M
    @STOP
    D;JGT // if i > n goto STOP

    @i
    D=M
    @sum
    M=M+D // sum = sum + i

    @i
    M=M+1 // i = i + 1
    
    @LOOP
    0;JMP // goto LOOP

(STOP)
    @sum
    D=M
    @R1
    M=D // RAM[1] = sum

(END)
    @END
    0;JMP