# Unit 6

## Assembler

- First software "layer"
- Lowest level
- Cross-compiling

## Basic Logic

- Repeat until end of file:
    - Read assembly command
    - Break into fields/parts
    - Lookup binary code for each field
    - Combine into a single machine language command
    - Output machine language command

## Symbol table

- Labels (used in loops, jumps)
- Variables (memory locations)
- For known symbols just look up on the symbol table and translate to actual location
- For unknown symbols, find unallocated memory positions and add them to the table

## Forward references

Possible solutions:
- Leave blank until label apperas, then fix or
- In first pass just figure out all addresses

## Specifications

Details of the assembly language described in Unit 4.

Must handle:
- White-space (empty lines/indentation, line comments, in-line comments)
- A-instructions / C-instructions
- Symbols (references or label declarations)

Steps:
- Develop basic assembler that translates symbol-less program
- Develop a way to handle symbols
- Morph the basic assembler into a symbol-aware assembler

### Instruction translation

Parser:
- For a-instruction, translate decimal value into binary value
- For c-instruction, splits instructions into parts: `dest = comp ; jump`
- Translate each part according to an opcode table
- Assemble opcodes into a binary instruction

Example: `MD=A-1;JGE`

Binary:
```
    C-instruction
    |
    |    A-1 comp opcode     JGE jump opcode
    |      ____|_____          _|_
    V     /           \       /   \
    1 1 1 0 1 1 0 0 1 0 0 1 1 0 1 1
      | /               \___/
      |/                  |
      |               MD dest opcode
      |
      Ignored, but 11 by convention
```

### Symbols translation

- Predefined symbols (special memory locations)
    - just translate for predefined value
- Label symbols (destination of goto instructions)
    - declared by pseudo-command `(LABEL)`
    - refers to the **next** instruction in the source code
    - store LABEL in lookup table with position of the next instruction
    - on a-instructions, just translate for stored value
- Variable symbols (memory location where the program wants to maintain values)
    - Any symbol not predefined and not declared by a (LABEL)
    - When first encountered, assign a unique memory address
    - Replace every occurrence with the same address

Symbol table:
- Use a data structure (dictionary, hash, map, etc) to hold symbol and value pairs
- Initialize symbol table with all predefined values
- First pass: Read source code counting instructions and on every (LABEL) add symbols to table
- Second pass:
    - For every symbol not on the table, add it to the table
    - For known symbols, just translate them

    - label symbols (destination of goto instructions)
    - declared by pseudo-command `(LABEL)`
    - refers to the **next** instruction in the source code
    - store LABEL in lookup table with position of the next instruction
    - on a-instructions, just translate for stored value

## Assembler architecture

- Read a file with a given name (xxx.asm)
- Write to a file with same name and .hack extension (xxx.hack)
- Repeat until EOF:
    - Move to next command in the file
    - Get the fields of the current command
        - Type (a-command, c-command or
        label)
        - Split on elements according to type
    - Translate mnemonic code to binary according to tables
    - Write to file
- Can assume input code is error free
- Suggested modules:
    - Parser
    - Code
    - Symbol Table
    - Main
