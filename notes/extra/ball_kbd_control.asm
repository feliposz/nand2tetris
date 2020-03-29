// A simple program to move a ball across the screen using the keyboard arrow keys

// init variables

    // how many cycles to wait between draw and erase (slow down)
    @10000
    D=A
    @wait_timer
    M=D

    // ball x offset
    @ball_x
    M=0
    @old_ball_x
    M=0

    // ball y offset
    @ball_y
    M=0
    @old_ball_y
    M=0

    // ball x movement
    @ball_dx
    M=1 // actually its a 16 bit pixel column

    // ball y movement
    @512
    D=A
    @ball_dy
    M=D

    @erase_value
    M=0

// Load ball sprite into RAM[1000-1015]
    @0
    D=A
    @1000
    M=D
    @992
    D=A
    @1001
    M=D
    @4088
    D=A
    @1002
    M=D
    @8188
    D=A
    @1003
    M=D
    @16382
    D=A
    @1004
    M=D
    @16382
    D=A
    @1005
    M=D
    @32767
    D=A
    @1006
    M=D
    @32767
    D=A
    @1007
    M=D
    @32767
    D=A
    @1008
    M=D
    @32767
    D=A
    @1009
    M=D
    @32767
    D=A
    @1010
    M=D
    @16382
    D=A
    @1011
    M=D
    @16382
    D=A
    @1012
    M=D
    @8188
    D=A
    @1013
    M=D
    @4088
    D=A
    @1014
    M=D
    @992
    D=A
    @1015
    M=D

(MOVE_LOOP)

// Begin erase ball

    @old_ball_x
    D=M
    @old_ball_y
    D=D+M
    @SCREEN
    D=D+A
    @pdst
    M=D

    @16
    D=A
    @nrows
    M=D

(ERASE_LOOP)
    @nrows
    D=M
    @END_ERASE_LOOP
    D;JEQ

    @erase_value
    D=M
    @pdst
    A=M
    M=D

    // update counter and pointers
    @32
    D=A
    @pdst
    M=D+M
    @nrows
    M=M-1

    // end loop
    @ERASE_LOOP
    0;JMP

(END_ERASE_LOOP)

// End erase ball

// Draw ball - begin
    @ball_x
    D=M
    @ball_y
    D=D+M
    @SCREEN
    D=D+A
    @pdst
    M=D

    @1000
    D=A
    @psrc
    M=D

    @16
    D=A
    @nrows
    M=D

    // loop until nrows == 0
(DRAW_LOOP)
    @nrows
    D=M
    @END_DRAW_LOOP
    D;JEQ

    // D = *psrc; *pdst = D
    @psrc
    A=M
    D=M

    @pdst
    A=M
    M=D

    // update counter and pointers
    @32
    D=A
    @pdst
    M=D+M
    @psrc
    M=M+1
    @nrows
    M=M-1

    // end loop
    @DRAW_LOOP
    0;JMP
(END_DRAW_LOOP)

// draw ball - end

// save old position
    @ball_x
    D=M
    @old_ball_x
    M=D

    @ball_y
    D=M
    @old_ball_y
    M=D

// handle keyboard input

(WAIT_KEY_RELEASE)
    @KBD
    D=M
    @WAIT_KEY_RELEASE
    D;JNE

(WAIT_KEY_PRESS)
    @KBD
    D=M
    @WAIT_KEY_PRESS
    D;JEQ
    @key_pressed
    M=D

// check key pressed

    @32 // SPACE
    D=A
    @key_pressed
    D=D-M
    @TOGGLE_ERASE
    D;JEQ

    @130
    D=A
    @key_pressed
    D=D-M
    @MOVE_LEFT
    D;JEQ

    @131
    D=A
    @key_pressed
    D=D-M
    @MOVE_UP
    D;JEQ

    @132
    D=A
    @key_pressed
    D=D-M
    @MOVE_RIGHT
    D;JEQ

    @133
    D=A
    @key_pressed
    D=D-M
    @MOVE_DOWN
    D;JEQ

    @140 // ESCAPE
    D=A
    @key_pressed
    D=D-M
    @BREAK
    D;JEQ

    @NO_MOVE
    0;JMP

// move ball according to key pressed

(MOVE_RIGHT)
    @ball_dx
    D=M
    @ball_x
    M=D+M
    @NO_MOVE
    0;JMP

(MOVE_LEFT)
    @ball_dx
    D=M
    @ball_x
    M=M-D
    @NO_MOVE
    0;JMP

(MOVE_DOWN)
    @ball_dy
    D=M
    @ball_y
    M=D+M
    @NO_MOVE
    0;JMP

(MOVE_UP)
    @ball_dy
    D=M
    @ball_y
    M=M-D
    @NO_MOVE
    0;JMP

(TOGGLE_ERASE)
    @erase_value
    M=!M

(NO_MOVE)

    // check horizontal warp
    @ball_x
    D=M
    @WARP_LEFT
    D;JLT // warp if x < 0

    @32
    D=A
    @ball_x
    D=M-D
    @WARP_RIGHT
    D;JGE // warp if x >= 32

    @CHECK_VERTICAL
    0;JMP

(WARP_LEFT)
    @31
    D=A
    @ball_x
    M=D
    @CHECK_VERTICAL
    0;JMP

(WARP_RIGHT)
    @0
    D=A
    @ball_x
    M=D

(CHECK_VERTICAL)

    // check vertical warp
    @ball_y
    D=M
    @WARP_UP
    D;JLT // warp if y < 0

    @7680 // 240 lines * 32 columns
    D=A
    @ball_y
    D=M-D
    @WARP_DOWN
    D;JGE // warp if y >= 7680

    @NO_WARP
    0;JMP

(WARP_UP)
    @7648
    D=A
    @ball_y
    M=D
    @NO_WARP
    0;JMP

(WARP_DOWN)
    @0
    D=A
    @ball_y
    M=D

(NO_WARP)

    @MOVE_LOOP
    0;JMP

(BREAK)
    @BREAK
    0;JMP
