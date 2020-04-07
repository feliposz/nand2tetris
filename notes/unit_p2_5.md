# Part 2 - Unit 5

Complete the compiler by implementing code generation.

Implementation:
- Procedural code
    - variables
    - expressions
    - flow of control
- Arrays
- Objects

Techniques:
- Parsing (mostly done on unit 4)
- Recursive compilation
- Code generation
- Symbol tables
- Memory management

## Variables

Source:
```
sum = x * (1 + rate)
```

Pseudo VM code:
```
push x
push 1
push rate
+
*
pop sum
```

Actual VM code:
```
push argument 2
push constan 1
add
call Math.multiply 2
pop local 3
```

Properties of variables:
- name (identifier)
- type (int, char, boolean, class name)
- kind (field, static, local, argument)
- scope (class level, subroutine level)

Symbol table:

- Keeps track of all symbols when compiling
- Two symbol tables: class-level, subroutine-level
- Class-level can be discarded for every new file/class being compiled
- Subroutine-level should be initialized for every new subroutine
- For methods, assume first argument is the name `this`
- When compiling, look up names on subroutine-level first, then in class-level second
- Throw error when not found (undefined)

Example of a class-level symbol table:

name      |type |kind    |#
----------|-----|--------|-
x         |int  |field   |0
y         |int  |field   |1
pointCount|int  |static  |0

Example of a ubroutine-level symbol table:

name      |type |kind    |#
----------|-----|--------|-
this      |Point|argumemt|0
other     |Point|argument|1
dx        |int  |local   |0
dy        |int  |local   |1

## Expressions

Generating coide:
- From infix to postfix
- Jack parser builds the syntax tree (infix)
- Conversion to postfix ( stack based vm)
- Alternatives:
    - Depth-first tree traversal
    - Use an alternative approach (one-stage, generate vm code on the fly) that handles:
        - number
        - variable
        - term op term
        - unaryOp term
        - fn(exp, exp, ...)
- Jack language doesn't have operator priority in order to make compiler easier to implement for students
- To enforce correct algebraic order, programmer has to use parentheses

## Flow control

If statement

```
Jack:
    if (expression) {
        statements1
    } else {
        statements2
    }

VM:
    compiled expression
    not
    if-goto L1
    compiled statements1
    goto L2
    label L1
    compiled statements2
    label L2
```

While statement

```
Jack:
    while (expression) {
        statements
    }

VM:
    label L1
    compiled expression
    not
    if-goto L2
    compiled statements
    goto L1
    label L2
```

- Make sure generated labels are unique
- Beware of nested statements

## Objects

Low-level details:
- Set THIS to the object address:
```
push 8000
pop pointer 0
```
- Access `this.xxx`
```
push/pop this N
```

Constructor:
- From the caller, a constructor behaves as any subroutine call
- Constructor must allocate memory to the object being createad and set this to the new object address
- It must return this to the caller
- Size of object is known from symbol table

```
push size of object
call Memory.alloc 1
pop pointer 0
...
// compiled constructor body
...
// translated from: return this
push pointer 0
return
```

Methods:
- OO method calls are translated to procedural machine language
- Object is passed implicitly as the first argument
- Inside the method, code just has to `push argument 0 / pop pointer 0` since first argument is always the object
- Void methods must `push constant 0` since VM code requires that all methods return one value
- `do` statements must `pop temp 0` returned value from methods to discard it

## Arrays

Low-level details:
- Set THAT to the array address:
```
// Access to memoery RAM[8000] = 17

push 8000
pop pointer 1
push 17
pop that 0
```
- Translate the adressing of an array element:
```
// let a[x] = a[y];
push a
push x
add            // stack has a+x
push b
push y
add            // stack has a+x, b+y
pop pointer 1  // that points to b+y, stack has a+x
push that 0    // stack has a+x, value of b[y]
pop temp 0     // store value of b[y] at temp, stack has a+x
pop pointer 1  // that points to a+x, stack is empty
push temp 0    // stack has value of b[y]
pop that 0     // store value of b[y] in a[x]
```
- Doing it this way allows the index to be any expression, not just a constant and will avoid overwriting the THAT pointer when moving data around.
- More generally:
```
// let a[expr1] = expr2;
push a
(generate code for expr1)
add            // save address of a[expr1]
(generate code for expr2)
pop temp 0     // move result of expr2 from stack to temp
pop pointer 1  // that points to address of a[expr1]
push temp 0    // move result of expr2 back to stack
pop that 0     // place result in a[expr1]
```

## Mapping

Objects:
- constructor: allocate memory, return this
- method: push object before call, set this to implicit argument 0 inside

Array:
- access addr[expr] by pushing addr+expr, `pop pointer 1`, then `push/pop that 0`

Constants:
- null = 0
- false = 0
- true = -1

OS services used by compiled Jack code:
- Math.multiply, Math.divide for * and /
- String.new(length) and String.appendChar(c) for string constants
- Memory.alloc(size) for object construction

## Implementation

Proposed implementation

- JackCompiler (top)
    - Input: file or directory
    - Output: 1 .vm for each .jack file
- JackTokenizer
    - Done on project 10
- SymbolTable
    - A table of symbols: name, type, kind (static, field, argument, local), number
    - Proposed methods: startSubroutine, define, varCount, kindOf, typeOf, indexOf
    - Needs 2 symbol tables (class-level and subroutine-level)
        - Clear class-level for each class
        - Clear subroutine-level for each subroutine
    - Each symbol not found on symbol table can be assumed to be a subroutine name or a class name.
- VMWriter
    - Proposed methods: constructor, writePush, writePop, writeArithmetic, writeLabel, writeGoto, writeIf, writeCall, writeCall, writeFunction, writeReturn, close
    - Isolates VM code implementation from the rest
- CompilationEngine
    - Use VMWriter to generate code

First step (optional):
- Implement Symbol Table
- Extend analyzer to output information about identifiers (category, index, defined or used)
- This allows to unit test the symbol table implementation

Second step:
- Evolve code generation using tested examples in order:
    - Seven
    - ConvertToBin
    - Square
    - Average
    - Pong
    - ComplexArrays
- Inspect generated code
- Load generate .vm code into VMEmulator
- Inspect results


