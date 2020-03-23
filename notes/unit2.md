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

