# Project 6

A simple Hack assembler and disassembler in javascript.

## Requirements

- Node.js

## Command line usage

Assembler:

```
node hackasm.js path/to/filename.asm
```

> Assembled code is written to `path/to/filename.hack`.

Disassembler:

```
node hackdis.js path/to/filename.hack
```

> Disassembled code is written to `path/to/filename_dis.asm`.

> **Note:** A suffix is added to filename (`_dis.asm`) to avoid overwriting original file by mistake.

## Library usage

Example:

```js
// Import library
const hacklib = require('./hacklib.js');

// Hack assembly code to add 2 numbers
const example = '@2\nD=A\n@3\nD=D+A\n@0\nM=D';

// Assemble source code to hack machine language
const bin = hacklib.asm(example);

// Disassemble hack machine language to hack assembly
const asm = hacklib.disasm(bin);
```

## Running tests

```
node test_hacklib.js
```
