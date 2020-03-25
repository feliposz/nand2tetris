// A simpler implementation with only one loop and that
// changes the fill "color" in the middle of drawing.

(FILL_START)
    @8192
    D=A
    @i
    M=D // i = 8192 (512 width x 256 height / 16-bits)

    @SCREEN
    D=A
    @address
    M=D // address = SCREEN

(FILL_LOOP)
    @i
    D=M
    @FILL_START
    D;JEQ // if i == 0 goto FILL_START

    @KBD
    D=M
    @WHITE
    D;JEQ
    D=-1
(WHITE)

    @address
    A=M
    M=D // *address = fill_value

    @address
    M=M+1 // address++

    @i
    M=M-1 // i--

    @FILL_LOOP
    0;JMP