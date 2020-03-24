# Unit 4

- Theory: Turing machine
- Practive: von Neumann Architecture

## Machine language

- Convenient for computers, not for humans
- Assembly language: Symbolic representation of machine language
- Assembler: Converts assembly language to machine code

## Elements

- Operations (arithmetic, logic, flow)
- Operands (data types, addressing)
- Control
- Correspondence to actual hardware (usually)
- Cost-performance tradeoff
    - Goal of Hack computer is simplicity, not performance
- Memory hierarchy
    - Memory access is expensive
    - Speed: Registers > Cache > Main memory > Disk
    - Size: Registers < Cache < Main memory < Disk
- Register: small "memory" inside CPU, quick, no delays
    - Data registers
    - Address registers
- Addressing modes
    - Register: use value in a register
    - Direct: access value at given address
    - Indirect: use value at address stored in register
    - Immediate: use value directly
- Input/output
    - Driver: software that knows the protocols to communicate with i/o devices
    - Memory mapping
- Flow
    - Sequence
    - Unconditional jump (example: loop)
    - Conditional jump (example: if, case, while, repeat, etc.)

## Hack computer

- 16-bit computer
- RAM is a sequence of 16-bit registers
- ROM is a sequence of 16-bit registers
- CPU 16-bit instructions
- Instruction bus, data bus, address buses
- Reset button
- Control:
    - Load program into ROM
    - Press "Reset button"
    - Program start running
- Registers:
    - D holds 16-bit value
    - A holds 16-bit value/address 
    - M represents 16-bit RAM register addressed by A
- A-instruction: `@value`
    - Example:

    ```
    // Set RAM[100] to -1
    @100 // A=100 (select RAM[100])
    M=-1 // RAM[100]=-1
    ```

- C-instruction: `dest = comp ; jump`
    - Destinations and jump are optional
    - Computations: 0, 1, -1, D, A, !D, !A, -D, -A, D+1, A+1, D-1, A-1, D+A, D-A, A-D, D&A, D|A (M can be used in place of A)
    - Destinations: null, M, D, MD, A, AM, AD, AMD (M refers to RAM[A])
    - Jump: null, JGT, JEQ, JGE, JLT, JNE, JLE, JMP
    - if (comp jump 0) jump to execute the instruction in ROM[A]

    - Examples:
    ```
    // Set the D register to -1
    D=-1

    // Set RAM[300] to the value of the D register minus 1
    @300  // A=300
    M=D-1 // RAM[300]=D-1

    // If (D-1==0) jump to execute the instruciton stored in ROM[56]
    @56
    null = D-1 ; JEQ
    ```

## Hack machine language

- A-instruction:
    - Symbol: @*value*
    - *value* is a non-negative decimal constant (0-32767) or
    - A symbol referring to a constant
    - Binary: 0 + binary representation of the constant
    - Example:
    ```
            _______________  value
            V             V
    @21 => 0000000000010101
           ^
           |
           0 = A-instruction
    ```
- C-instruction
    - Symbol: *dest* = *comp* ; *jump*

    - Binary:
    ```
               comp (ALU)      dest     jump
           _________________   ______   ______
          /                 \ /      \ /      \
    1 1 1 a c1 c2 c3 c4 c5 c6 d1 d2 d3 j1 j2 j3
    | | |
    | | |_ not used (1 by convention)
    | |___ not used (1 by convention)
    |_ opcode
    ```
- Mapping of the *comp* bits:

c1 | c2 | c3 | c4 | c5 | c6 | a=0  | a=1
---|----|----|----|----|----|------|-----
1  | 0  | 1  | 0  | 1  | 0  | 0    |
1  | 1  | 1  | 1  | 1  | 1  | 1    |
1  | 1  | 1  | 0  | 1  | 0  | -1   |
0  | 0  | 1  | 1  | 0  | 0  | D    |
1  | 1  | 0  | 0  | 0  | 0  | A    | M
0  | 0  | 1  | 1  | 0  | 1  | !D   |
1  | 1  | 0  | 0  | 0  | 1  | !A   | !M
0  | 0  | 1  | 1  | 1  | 1  | -D   |
1  | 1  | 0  | 0  | 1  | 1  | -A   | -M
0  | 1  | 1  | 1  | 1  | 1  | D+1  | M+1
1  | 1  | 0  | 1  | 1  | 1  | A+1  | M+1
0  | 0  | 1  | 1  | 1  | 0  | D-1  |
1  | 1  | 0  | 0  | 1  | 0  | A-1  | M-1
0  | 0  | 0  | 0  | 1  | 0  | D+A  | D+M
0  | 1  | 0  | 0  | 1  | 1  | D-A  | D-M
0  | 0  | 0  | 1  | 1  | 1  | A-D  | M-D
0  | 0  | 0  | 0  | 0  | 0  | D&A  | D&M
0  | 1  | 0  | 1  | 0  | 1  | D\|A | D\|M

- Mapping of the *dest* bits:

dest | d1 | d2 | d3 | effect
-----|----|----|----|---------
null | 0  | 0  | 0  | not stored
M    | 0  | 0  | 1  | RAM[A]
D    | 0  | 1  | 0  | D register
MD   | 0  | 1  | 1  | RAM[A] and D register
A    | 1  | 0  | 0  | A register
AM   | 1  | 0  | 1  | A register and RAM[A]
AD   | 1  | 1  | 0  | A register and D register
AMD  | 1  | 1  | 1  | A register, RAM[A] and D register

- Mapping of the *jump* bits:

dest | j1 | j2 | j3 | effect
-----|----|----|----|---------
null | 0  | 0  | 0  | no jump
JGT  | 0  | 0  | 1  | if out>0 jump
JEQ  | 0  | 1  | 0  | if out=0 jump
JGE  | 0  | 1  | 1  | if out<=0 jump
JLT  | 1  | 0  | 0  | if out<0 jump
JNE  | 1  | 0  | 1  | if out!=0 jump
JLE  | 1  | 1  | 0  | if out<=0 jump
JMP  | 1  | 1  | 1  | unconditional jump

- Example instruction

```
Binary:

      comp   dst jmp
cod a 123456 123 123
--- - ------ --- ---
111 1 010101 101 100

    a = 1, so use M instead of A
    comp bits 010101 => D|M
    dest bits 101 => AM
    jump bits 100 => JLT

Symbolic:
    AM = D|M ; JLT
```

## Hack input/output

- High-level vs. low-level approach

### Screen

- Memory map
    - Physical display is continuosly refreshed many times per second
    - 512 columns by 256 rows
    - black/white (1 or 0)
    - 512 * 256 => 131072 bits => 8192 words (16-bit memory)
    - Access is only one word at a time (16-bits)
- Access
    - Set a pixel (row, col) on/off

    ```
    word = Screen[32*row + col/16]
    or
    word = RAM[16384 + 32*row + col/16]
    ```

    - Set the col%16 bit of word to 0 or 1
    - Commit *word* to RAM

### Keyboard

- 16-bit scancode (0 = no keypress)
- Memory map
    - Probe *Keyboard* chip or RAM[24576]
