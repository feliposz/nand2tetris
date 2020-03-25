// draw a filled rectangle at upper left corner 
// width = 16 pixels
// height = R0 pixels 

    @R0
    D=M
    @n
    M=D // n = R0

    @i
    M=0 // i = 0

    @SCREEN
    D=A
    @address
    M=D // address = SCREEN

(LOOP)
    @i
    D=M
    @n
    D=D-M
    @END
    D;JEQ // goto END if i == n

    @address
    A=M
    M=-1 // *address = -1

    @i
    M=M+1 // i++

    @32 // 512 pixels / 16 bits = 32 words = row size
    D=A
    @address
    M=M+D // *address += 32

    @LOOP
    0;JMP

    @END
(END)
    0;JMP