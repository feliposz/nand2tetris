// Swap values from RAM[0] and RAM[1]
// Uses RAM[2] as temporary swap
@R1
D=M // D=RAM[1]
@R2
M=D // RAM[2]=D
@R0
D=M // D=RAM[0]
@R1
M=D // RAM[1]=D
@R2
D=M // D=RAM[2]
@R0
M=D // RAM[0]=D
@13
0;JMP // JMP 13 (BREAK)