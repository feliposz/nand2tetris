// multiplication (by shift and add)
// multiply R0 by R1 and store result in R2
// note: overflow will occur for results > 32767 or <= -32768

//TODO: adjust signals for negative multiplier

    @R0
    D=M
    @shifted // shifted multiplicand
    M=D
    @result
    M=0

    @testbit // shifted test bit
    M=1

    @15
    D=A
    @bitcount
    M=D // bits left to multiply

(LOOP)
    // repeat until counter == 0
    @bitcount
    D=M
    @END_LOOP
    D;JEQ

    // test current bit
    @testbit
    D=M
    @R1
    D=D&M
    @SKIP_ADD
    D;JEQ

    // add shifted value to result
    @shifted
    D=M
    @result
    M=D+M

(SKIP_ADD)
    // left shift value
    @shifted
    D=M
    M=D+M

    // left shift test bit
    @testbit
    D=M
    M=D+M

    // decrement counter
    @bitcount
    M=M-1

    @LOOP
    0;JMP
(END_LOOP)

    @result
    D=M
    @R2
    M=D

(END)
    @END
    0;JMP
