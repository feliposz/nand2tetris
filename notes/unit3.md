# Unit 3

## Sequential logic

- Time unit concept
- Physical delay in circuit propagation
- Thinking in integer time steps
- Combinatorial: `out[t] = f(in[t])`
- Sequential: `out[t] = f(in[t-1])`

## Clocked Data Flip Flop (DFF)

- DFF is a primitive like Nand in this course
- Can be physically implemented with Nand and loops
- The simulator does not allow combinatorial loops

DFF:

```
      +-----+
in -> | DFF | -> out
      +--^--+

      out[t] = in[t-1]
```

# 1-bit register

```
        load
         |
         v
      +-----+
in -> | Bit | -> out
      +--^--+

      if load(t-1) then out[t] = in[t-1]
                   else out[t] = out[t-1]
```

# Project 3

- Bit
- Register
- Program Counter
- RAM 8
- RAM 64
- RAM 512
- RAM 4K
- RAM 16K
