# Project 9

An implementation in the language Jack of a **small subset** of the graphical educational language [Logo](https://en.wikipedia.org/wiki/Logo_(programming_language)).

## Requirements

- Jack compiler (found in `\tools\jackcompiler.bat`)
- VM emulator (found in `\tools\vmemulator.bat`)

## Compiling and running

At the root of the nand2tetris directory:

```
cd projects\09
..\..\tools\jackcompiler.bat Logo
..\..\tools\vmemulator.bat
```

Inside the VM Emulator, use *File > Load Program* and go to `nand2tetris\projects\09\Logo` directory.

## Usage

On the `?` prompt, enter `HELP` to get the following screen:

```
HELP
----

HELP          Show this help screen
QUIT          Quit program
DEMO id       Demonstration mode (where id = 0 to 3)

CS            Clear screen
FD distance   Move forward
BK distance   Move backwards
RT angle      Turn right
LT angle      Turn left
PD            Pen down (start drawing)
PU            Pen up (stop drawing)

REPEAT times [ commands ]
              Repeat the list of commands inside brackets

*NOTE* It is possible to enter more than one command per line.
```

Enter `DEMO` and a number from 0 to 3 to see a few examples of Logo in action.

## Motivation

- Logo was the first thing that I've learned on a computer. :)
- The *Nand2tetris* course shows how much can be done from just a few components (a full computer from Nand gates, just 18 opcodes in the Hack language, a simple object-oriented language).
- Logo also shows how much you can do with just a few drawing commands.

Have fun! :)
