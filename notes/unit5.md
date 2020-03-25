# Unit 5

## Hack architecture

Components:
- CPU
    - ALU
    - Registers
- Memory
    - Data
    - Program
- Buses
    - Control
    - Address
    - Data

ALU:

- Reads from data bus
- Operate on them according to control bus
    
Registers:

- Address registers
- Data registers

Memory

- Data
    - Address of data
    - Read/write access
- Program
    - Address
    - Read instruction
    - May contain data
    - Feed into control bus

## Fetch-execute cycle

Cycle:
- Fetch
    - Increment program counter
    - Put location of next instruction on address of program memory
    - Get instruction by reading memory and place it an instruction register
- Execute
    - Take bits from instruction that tell what to do
    - Take bits that tell where data is (memory, registes)
- Repeat

Architecture:
- Von Neumann
    - Multiplexer used to point to program or data memory
    - Instruction and data fetched in differen cycles
- Harvard
    - Separate data and program
    - Simpler to implement

## Hack CPU

Inputs:
- inM[16] from data memory
- instruction[16] from instruction/program memory
- reset from user

Outputs:
- outM[16] to data memory
- writeM to data memory
- addressM[15] to data memory
- pc[15] to instruction/program memory

Components:

- ALU
- Register A
- Register D
- Program Counter

## Memory

- RAM 16k
- Screen Chip
- Keyboard Chip

## Computer

Components:
- CPU
- RAM
- ROM32k
