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