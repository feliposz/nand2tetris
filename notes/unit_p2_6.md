# Part 2 - Unit 6

OS services

## Math
- Multiply (shift and add)
- Divide (long division)
```
divide(x, y):
    if (y > x) return 0
    q = divide(x, 2 * y) // Note: watch overflow of y
    if ((x - 2 * q * y) < y)
        return 2*q
    else
        return 2*q+1
```
- Square root (binary search)
```
sqrt(x)
    y = 0
    for j = n/2-1 .. 0 do
        // Note: watch overflow of (y + 2^j) ^ 2...
        if (y + 2^j) ^ 2 <= x then y = y + 2^j
    return y
```
- To efficiently calculate 2^j:
    - Could use bit shift on hardware that supports it
    - Since the Hack computer doesn't have bit shift, build a static lookup table on Math.init
- Handle division of negative numbers (abs) and overflow of y

## Memory

Memory access pseudocode:

```
static Array ram

init:
    ram = 0

peek(addr):
    return ram[addr]

poke(addr, value):
    ram[addr] = value
```

Memory management

- Heap segment: 2048 - 16383
- Linked list of free blocks
    - next
    - size
    - free space
- Alloc(reqSize)
    - Scan list of free blocks
    - Possible if block->size > reqSize + 2
    - Use first fit or best fit
    - If no free block found:
        - Return failure
        - Optional: attempt memory defragmentation
    - Update freeList
    - Return block
- Dealloc(addr)
    - Append free block to end of list

## Screen

Draw primitives
- General idea, not final implementation
- Handle special cases
- 

```
drawPixel(x, y):
    addr = y * 32 + x / 16
    bit = x % 16
    set bit on memory at addr

drawLine(x1, y1, x2, y2):
    dx = x2 - x1
    dy = y2 - y1
    a = 0
    b = 0
    diff = 0
    while (a <= dx and b <= dy)
        drawPixel(x+a, y+b)
        if (diff < 0)
            a += 1
            diff += dx
        else
            b += 1
            diff -= dy

drawCircle(x, y, r)
    for dy = 0 to r
        dx = sqrt(r^2 - dy^2) // check overflow ?
        drawLine(x - dx, y - dy, x + dx, y - dy)
        drawLine(x - dx, y + dy, x + dx, y + dy)

```
