# Part 2 - Unit 1

- Abstraction
    - Assembler
    - Virtual machine
    - Compiler
    - Operating system

Example of a program written on the Jack programming language.

```
class Main {
    function main void() {
        var Point p1, p2, p3;
        let p1 = Point.new(1, 2);
        let p2 = Point.new(3, 4);
        let p3 = p1.plus(p2);
        do p3.print();
        do Output.println();
        do Output.println(p1.distance(p3));
        return;
    }
}
```

Steps:

```
                    +--> VM Emulator
                    |
  High             VM           Assembly      Machine
  level            code         code          code

program.jack ->  program.vm -> program.asm -> program.hack -> Hack CPU

             1st            2nd          assembler
            stage          stage
           compiler       compiler
```

## Virtual Machine

- Thinking in an abstract level, independent of implementation
- Stack machine
    - Operations: Push, Pop
    - Stack pointer (SP)
    - Stack memory segment

## Arithmetic/logical commands:

Command | Return value | Return type
--------|--------------|------------
add     | x + y        | integer
sub     | x - y        | integer
neg     | -y           | integer
eq      | x == y       | boolean
gt      | x > y        | boolean
lt      | x <> y       | boolean
and     | x and y      | boolean
or      | x or y       | boolean
not     | not y        | boolean

## VM memory segments

- Segments: argument, local, static, constant, this, that, pointer, temp
- Variable names/symbols not translated
- push *segment* *i*
- pop *segment* *i*

## Stack implementation

- SP stored in RAM[0] points at next available
- Stack base address = 256

Example of a translation for the VM instruction `push constant 17` into Hack assembly:

```
@17
D=A
@SP
A=M
M=D   // *SP = 17
@SP
M=M+1 // SP++
```

## Segments

### *local* segment

- LCL stored in RAM[1] is base address for *local* segment

Implementation logic:

```
pop local i:
    addr = LCL + i
    SP--
    *addr = *SP

push local i:
    addr = LCL + i
    *SP = *addr
    SP++
```

### *argument, this, that* segments

- All implemented in the same way, just using different base pointers.

### *contant* segment

- No `pop constant`
- Implementation: `push constant i` -> `*sp = i, sp++`

### *static* dedicated segment (global space)

- Translate into assembly as `filename.i`
- Example:

File `Foo.vm`
```
pop static 5

    // ... pop value from stack into D
    @Foo.5
    M=D
```

- Assembly will map from RAM[16] to RAM[255] in the order they appear

### *temp* segment

- 8 fixed positions
- Mapped on RAM[5] to RAM[12]

```
pop temp i:
    addr = 5 + i
    SP--
    *addr = *SP

push temp i:
    addr = 5 + i
    *SP = *addr
    SP++
```

### *pointer* segment

- Used by the compiler to handle THIS/THAT
- 2 fixes positions 0/1
- Accessing `pointer 0` result in accessing THIS
- Accessing `pointer 1` result in accessing THAT
- Implementation:

```
push pointer 0/1
    *sp = THIS/THAT
    sp++

pop pointer 0/1:
    sp--
    THIS/THAT = *sp
```

## Standard VM mapping

Hack RAM
- SP: 0
- LCL: 1
- ARG: 2
- THIS: 3
- THAT: 4
- Temp: 5-12
- General registers: 13-15
- Static variables: 16-255
- Stack: 256-2047

## Implementation

Suggested design:
- Main
    - Get input: filename.vm
    - Get output: filename.asm
    - Marches through input file, parsing each line and generating code from it
- Parser
    - Open file for reading
    - Reads VM command, parses into lexical components and provides access to these components
    - Ignores all white spac and comments
    - Methods: constructor, hasMoreCommands, advance, commandType (C_ARITHMETIC, C_PUSH, C_POP, C_CALL, etc), arg1: string, arg2: int
- CodeWriter
    - Generate assembly code from parsed VM command
    - Methods: Constructor, writeArithmetic, writePushPop, Close
