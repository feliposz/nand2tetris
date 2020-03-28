// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

    @R0
    D=M
    @multiplicand
    M=D // multiplicand = R0

    @R1
    D=M
    @multiplier
    M=D // multiplier = R1

    @product
    M=0 // product = 0

(LOOP)
    @multiplier
    D=M
    @RESULT
    D;JEQ // if multiplier == 0 GOTO RESULT
    @multiplicand
    D=M
    @product
    M=D+M // product += multiplicand
    @multiplier
    M=M-1 // multiplier--
    @LOOP
    0;JMP

(RESULT)
    @product
    D=M
    @R2
    M=D // R2 = product

(END)
    @END
    0;JMP
