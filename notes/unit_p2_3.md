## Part 2 - Unit 3

## Jack language

- Similar to Java and other OO high-level languages
- Object oriented, no inheritance
- Program can have one or more classes
- Filename == Classname (first letter must be uppercase)
- Starts in class Main, `function void main()`
- Built-in types:
    - int
    - char
    - boolean
- Variables must be declared before use
- OS classes:
    - Keyboard
    - Screen
    - Output
    - Sys
    - Memory
    - Array
    - String
    - Math
- Keywords:
```
class, constructor, method, function
int, boolean, char, void
var, static, field
let, do, if, else, while, return
true, false, null, this
```
- Operators: `+ - * / & | ^ < > =`
- **Note:** Operator priority not enforced in language! Use parentheses when needed! (This is to make compiler construction easier.)
- Symbols: `() [] {} , ; = .`

## Class definition

- No public fields
- All access to fields has to be through methods
- Types of subroutines:
    - field (member variables)
    - constructor (creates instance)
    - method (access instance)
    - function (like static class functions)
- `this` is an address to the base of the object

```
class Name {
    field int f1, f2; // fields and static must appear first!
    static int s1, s2;

    // "new" is a convention, may have other constructor with other names
    constructor Name new (int p1, int p2) {
        let f1 = p1; // assignment with: let
        let f2 = p2;
        do emptyFunction(); // function call with: do
        return this;
    }

    method int getF1() {
        return f1;
    }

    method int getF2() {
        return f2;
    }

    function void emptyFunction() {
        return; // must have a return
    }

    method void dispose() { 
        // Jack has no garbage collection
        // so this is necessary in classes that can be instantiated
        do Memory.deAlloc(this);
        return;
    }
}
```
