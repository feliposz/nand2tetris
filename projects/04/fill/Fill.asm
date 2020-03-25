// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

(WAIT_KEY_PRESS)
    @KBD
    D=M
    @WAIT_KEY_PRESS
    D;JEQ // if key == 0 goto WAIT_KEY_PRESS

    @fill_value
    M=-1 // fill = -1

    @FILL_START
    0;JMP

(WAIT_KEY_RELEASE)
    @KBD
    D=M
    @WAIT_KEY_RELEASE
    D;JNE // if key != 0 goto WAIT_KEY_RELEASE

    @fill_value
    M=0 // fill_value = 0

    @FILL_START
    0;JMP

(FILL_START)
    @8192
    D=A
    @i
    M=D // i = 8192 (512 width x 256 height / 16-bits)

    @SCREEN
    D=A
    @address
    M=D // address = SCREEN

(FILL_LOOP)
    @i
    D=M
    @FILL_END
    D;JEQ // if i == 0 goto FILL_END

    @fill_value
    D=M
    @address
    A=M
    M=D // *address = fill_value

    @address
    M=M+1 // address++

    @i
    M=M-1 // i--

    @FILL_LOOP
    0;JMP

(FILL_END)
    @fill_value
    D=M

    @WAIT_KEY_PRESS
    D;JEQ // if fill_value = 0 then goto WAIT_KEY_PRESS

    @WAIT_KEY_RELEASE
    0;JMP // else goto WAIT_KEY_RELEASE
