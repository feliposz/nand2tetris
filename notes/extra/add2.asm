// Adds up two numbers
// Usage: put the values in RAM[0] and RAM[1]
// Output: RAM[2]
@R0
D=M   // D = RAM[0]
@R1
D=D+M // D = D + RAM[1]
@R2
M=D   // RAM[2] = D
@7
0;JMP