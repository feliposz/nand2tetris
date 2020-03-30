# Part 2 - Unit 1

- Abstraction
    - Assembler
    - Virtual machine
    - Compiler
    - Operating system

Example of a program written on the Jack programming language.

```
class Main {
    function main void() {
        var Point p1, p2, p3;
        let p1 = Point.new(1, 2);
        let p2 = Point.new(3, 4);
        let p3 = p1.plus(p2);
        do p3.print();
        do Output.println();
        do Output.println(p1.distance(p3));
        return;
    }
}
```

Steps:

```
  High             VM           Assembly      Machine
  level            code         code          code

program.jack ->  program.vm -> program.asm -> program.hack -> CPU

             1st            2nd          assembler
            stage          stage
           compiler       compiler
```