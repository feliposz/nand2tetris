# Binary addition

- Carry bit
- Overflow
- Half adder (2 bits)
- Full adder (3 bits)
- Adder (2 numbers)

## Half Adder

- input a
- input b
- output sum
- output carry

## Full adder

- input a
- input b
- input c (previous carry)
- output sum
- output carry

## Adder 16-bit

- 16 FullAdders
- Connect the carry output from previous FullAdder to next c input

## Negative

- Sign bit
- 2's complement

Example to get from +4 to -4:

```
+4 => 0100 (original positive number)
      1011 (negate all bits)
        +1 (add 1)
-4 <= 1100
```

The reverse is:

```
-4 => 1100 (original negative number)
      0011 (negate all bits)
        +1 (add 1)
+4 <= 0100
```

## Von Neumann architecture

- Arithmetic Logic Unit (ALU)
- Inputs:
    - input1, input2 (multi-bit)
    - functions:
        - arithmetic: addition, multiplication, etc.
        - logical: and, or, not, etc.
        - The ALU may contain more or less functions by design. Additional functions may be implemented at software level.
- Hack ALU:
    - 2 16-bit inputs (x, y)
    - 1 16-bit output (out)
    - function set by 6 input bits:
        - zx (zero x)
        - nx (not/negate/invert bits of x)
        - zy (zero y)
        - ny (not/negate/invert bits of y)
        - f (function add/and)
        - no (not/negate/invert bits of out)
    - results in 18 functions of interest:
        - 0 (output zero)
        - 1 (output one)
        - -1 (output -1)
        - x (output x)
        - y (output y)
        - !x (not x)
        - !y (not y)
        - -x (negative x)
        - -y (negative y)
        - x+1 (increment x)
        - y+1 (increment y)
        - x-1 (decrement x)
        - y-1 (decrement y)
        - x+y (add x and y)
        - x-y (subtract y from x)
        - y-x (subtract x from y)
        - x&y (x and y)
        - x|y (x or y)
    - control bits:
        - zr
        - ng

Control-bits X function table:

zx | nx | zy | ny | f  | no | function
---|----|----|----|----|----|----------
1  | 0  | 1  | 0  | 1  | 0  | 0
1  | 1  | 1  | 1  | 1  | 1  | 1
1  | 1  | 1  | 0  | 1  | 0  | -1
0  | 0  | 1  | 1  | 0  | 0  | x
1  | 1  | 0  | 0  | 0  | 0  | y
0  | 0  | 1  | 1  | 0  | 1  | !x
1  | 1  | 0  | 0  | 0  | 1  | !y
0  | 0  | 1  | 1  | 1  | 1  | -x
1  | 1  | 0  | 0  | 1  | 1  | -y
0  | 1  | 1  | 1  | 1  | 1  | x+1
1  | 1  | 0  | 1  | 1  | 1  | y+1
0  | 0  | 1  | 1  | 1  | 0  | x-1
1  | 1  | 0  | 0  | 1  | 0  | y-1
0  | 0  | 0  | 0  | 1  | 0  | x+y
0  | 1  | 0  | 0  | 1  | 1  | x-y
0  | 0  | 0  | 1  | 1  | 1  | y-x
0  | 0  | 0  | 0  | 0  | 0  | x&y
0  | 1  | 0  | 1  | 0  | 1  | x|y

## Hack ALU operation

Operation according to the bits:

- if zx then x=0
- if nx then x=!x
- if zy then y=0
- if ny then y=!y
- if f then out=x+y else out=x&y
- if no then out=!out

Control bits:

- if out == 0 then zr=1 else zr=0
- if out < 0 then ng=1 else ng=0
