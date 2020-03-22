# Teachers

Simon Schocken & Noam Nisan

# Boolean identities

Commutative laws
```
x and y = y and x
x or y = y or x
```

Associative laws
```
x and (y and z) = (x and y) and z
x or (y or z) = (x or y) or z
```

Distributive laws
```
x and (y or z) = (x and y) or (x and z)
x or (y and z) = (x or y) and (x or z)
```

De Morgan laws
```
not(x and y) = not(x) or not(y)
not(x or y) = not(x) and not(y)
```

# NAND gate

Not-And truth table:

| a | b | out |
|---|---|-----|
| 0 | 0 | 1   |
| 0 | 1 | 1   |
| 1 | 0 | 1   |
| 1 | 1 | 0   |

Proof that any boolean logic circuit can be build with just NAND gates.

```
nand(x, y) = not(x and y)

not(x) = nand(x, x)
and(x, y) = not(nand(x, y))
```

# Hardware Description Language (HDL)

Xor gate example:

| a | b | out | cases
|---|---|-----|-------------
| 0 | 0 | 0   | -
| 0 | 1 | 1   | `not a and b`
| 1 | 0 | 1   | `a and not b`
| 1 | 1 | 0   | -

Formula: `(a and not b) or (not a and b)`

Circuit diagram:

```
a --o-----------+    ____
    |           +---|    \   aAndNotb
    |               | AND |----+ 
    |           +---|____/     |   
    +-| NOT >o--+              |   ____
                  nota         +--\    \
                                   ) OR )-- out
                  notb         +--/____/
    +-| NOT >o--+    ____      |
    |           +---|    \     |
    |               | AND |----+ 
    |           +---|____/   notaAndb
b --o-----------+ 

```

Example HDL implementation:

```vhdl

/* Xor gate: out = (a And Not(b)) Or (Not(a) And b)) */

CHIP Xor {
    IN a, b;
    OUT out;

    PARTS:
    Not (in=a, out=nota);
    Not (in=b, out=notb);
    And (a=a, b=notb, out=aAndNotb);
    And (a=nota, b=b, out=notaAndb);
    Or  (a=aAndNotb, b=notaAndb, out=out);
}
```

