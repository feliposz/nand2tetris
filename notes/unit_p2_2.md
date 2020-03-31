## Part 2 - Unit 2

- Branching
- Functions
- Function call and return
- Dynamic memory management
- Stack processing
- Pointers
- Completing the VM implementation

## Branching

- `label NAME`
- Unconditional: `goto NAME`
- Conditional: `if-goto NAME`

## Functions

- Calling: `call NAME nArgs`
    - Arguments are pushed into stack before call
    - On return, arguments are popped and the return value is pushed on the stack.
    - *nArgs* informs how many arguments on the stack are being passed to the function.
- Declaring:  `function NAME nVars`
    - *nVars* informs how many local variables are used inside the function.
- Return from function: `return`

Implementation:

- Call:
    - pass parameters
    - determine return address
    - save return address, stack and memory segments
    - jump to execute function
- Return:
    - return computed value
    - recycle memory resources used by called function
    - restore stack and memory segments from callee
    - jump to return address

Call implementation:
- Sets *arg*
- Save the caller's frame:
    - return address
    - saved LCL
    - saved ARG
    - saved THIS
    - saved THAT
- Jump to function code

Function implementation:
- Generate a label
- Set up local segment (set LCL and push N zeros to stack)

Return implementation:
- Set endFrame = LCL (temporary)
- Set retAddr = endFrame - 5 (another temp)
- Copy return value (top of the stack) to argument 0 location (will be the top of the stack after return code cleans up space)
- Restore the segment pointers of the caller in reverse order
- Clear the stack (locals and arguments)
- Set SP for the caller
- Jump back to return address

Conventions:
- All `*.vm` files translated to a single `.asm` file
- There should be a single `Main.vm` with a `Main` function declaration.
- The VM code should start by setting SP=256 and calling `Sys.init` (os initialization) which in turn will call `Main.main` when ready
- Labels for `goto` and `if-goto` in the format `functionName$label`
- Label for `function` in the format `functionName`
- Label for the return point after `call` in the format `functionName$ret.i`
- VM translator should handle a single .vm file or a directory of .vm files.
- Output of directory should be `directoryName.asm`