// shift left operation
// R0 = number to be shifted
// R1 = bits to shift left
// R2 = result

// calculate jump to shift sequence (skip as needed)

    @R1
    D=M
    @INVALID
    D;JLT // invalid if bits < 0

    @16
    D=A
    @R1
    D=D-M // 16 - bits
    @INVALID
    D;JLT // invalid if bits > 16
    A=D
    D=D+A // 2 * (16 - bits)
    @SHIFT_INIT
    D=D+A // SHIFT_INIT + 2 * (16 - bits)

// store jump address on R2 (used as a temp var)
    @R2
    M=D

// load value to be shifted
    @R0
    D=M

// initiate shift sequence
    @R2
    A=M
    0;JMP
(SHIFT_INIT)
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A
    A=D
    D=D+A

// store result
    @R2
    M=D

(END)
    @END
    0;JMP

(INVALID)
    @R0
    M=-1
    @R1
    M=-1
    @R2
    M=-1
    @END
    0;JMP
