// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
// Enhanced to handle negative numbers
// Swap operands if necessary to reduce loops needed

    @signal
    M=1 // signal = 1

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

    // if multiplicand < 0 then multiplicand = -multiplicand ; signal = -signal
    @multiplicand
    D=M
    @POSITIVE_MULTIPLICAND
    D;JGE
    D=-D
    @multiplicand
    M=D
    @signal
    M=-M
(POSITIVE_MULTIPLICAND)

    // if multiplier < 0 then multiplier = -multiplier ; signal = -signal
    @multiplier
    D=M
    @POSITIVE_MULTIPLIER
    D;JGE
    D=-D
    @multiplier
    M=D
    @signal
    M=-M
(POSITIVE_MULTIPLIER)

    // small optimization - move the lesser value to multiplier to reduce necessary loops
    
    // if multiplier > multiplicand then swap(multiplicand, multiplier)
    @multiplier
    D=M
    @multiplicand
    D=D-M
    @NO_SWAP
    D;JLT

    // temp = multiplicand
    // multiplicand = multiplier
    // multiplier = temp
    @multiplicand
    D=M
    @temp
    M=D
    @multiplier
    D=M
    @multiplicand
    M=D
    @temp
    D=M
    @multiplier
    M=D
(NO_SWAP)

(LOOP)
    @multiplier
    D=M
    @RESULT
    D;JEQ // if multiplier == 0 GOTO RESULT
    @multiplicand
    D=M
    @product
    M=M+D // product += multiplicand
    @multiplier
    M=M-1 // multiplier--
    @LOOP
    0;JMP

(RESULT)
    // if signal < 0 then product = -product
    @signal
    D=M
    @POSITIVE_SIGNAL
    D;JGT
    @product
    M=-M
(POSITIVE_SIGNAL)

    @product
    D=M

    @R2
    M=D // R2 = product

(END)
    @END
    0;JMP
