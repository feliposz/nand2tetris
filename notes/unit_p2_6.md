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