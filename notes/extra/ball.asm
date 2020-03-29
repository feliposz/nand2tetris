// A simple program to draw a ball sprite to screen at left/upper corner
// Steps:
// 1) Load sprite data into RAM since program can't load data from ROM directly
// 2) Initialize variables to point to source (sprite) and destination (screen) addresses
// 3) Loop copying source to destination

// Load sprite into RAM[1000-1015]
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

// init variables
    @1000
    D=A
    @psrc
    M=D

    @SCREEN
    D=A
    @pdst
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

(BREAK)
    @BREAK
    0;JMP
