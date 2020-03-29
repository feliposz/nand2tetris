// A simple program to bounce a ball across the screen

// init variables

    // how many cycles to wait between draw and erase (slow down)
    @10000
    D=A
    @wait_timer
    M=D

    // ball x offset
    @0
    D=A
    @ball_x
    M=D

    // ball y offset
    @0
    D=A
    @ball_y
    M=D

    // ball x movement
    @1 // actually its a 16 bit pixel column
    D=A
    @ball_dx
    M=D

    // ball y movement
    @128
    D=A
    @ball_dy
    M=D


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

    // skip a few cycles
    @wait_timer
    D=M
(WAIT)
    @WAIT
    D=D-1;JGT

// Erase ball
    @ball_x
    D=M
    @ball_y
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

    @pdst
    A=M
    M=0

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


    // update ball position
    @ball_dx
    D=M
    @ball_x
    M=D+M

    @ball_dy
    D=M
    @ball_y
    M=D+M

    // check horizontal bounce
    @ball_x
    D=M
    @BOUNCE_X
    D;JLT // bounce if x < 0

    @32
    D=A
    @ball_x
    D=M-D
    @BOUNCE_X
    D;JGE // bounce if x >= 32

    @CHECK_VERTICAL
    0;JMP

(BOUNCE_X)
    @ball_dx
    MD=-M
    @ball_x
    M=D+M

(CHECK_VERTICAL)

    // check vertical bounce
    @ball_y
    D=M
    @BOUNCE_Y
    D;JLT // bounce if y < 0

    @7680 // 240 lines * 32 columns
    D=A
    @ball_y
    D=M-D
    @BOUNCE_Y
    D;JGE // bounce if y >= 7680

    @NO_BOUNCE
    0;JMP

(BOUNCE_Y)
    @ball_dy
    MD=-M
    @ball_y
    M=D+M

(NO_BOUNCE)

    // TODO: bounce on walls

    @MOVE_LOOP
    0;JMP

(BREAK)
    @BREAK
    0;JMP
