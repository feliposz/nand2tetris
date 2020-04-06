## Part 2 - Unit 4

Topics:
- Tokenizer (lexical analysis)
- Parser
- Grammars
- Parse trees
- XML/mark-up
- Compilation
- Handling data

Applications
- Processing files with predefined structure

Project 10:
- Syntax analyzer
    - Tokenizer/Parser
- Generate intermediate XML

## Tokenizer

- Skip white space and comments
- Types of tokens
    - keyword
    - symbol
    - integerConstant
    - StringConstant
    - identifier
- Program: TokenizerTest
- Class/library: JackTockenizer
    - constructor(filename)
    - hasMoreTokens()
    - tokenType()
    - tokenValue()
    - advance()

## Grammar

- Set of rules
- Template name (left) and composition (right)
- Terminal rule: right hand only has constants
- Non-terminal rule: all others
- Example:

Jack grammar (subset):

```
statement: ifStatement | whileStatement | letStatement

statements: statement*

ifStatement: 'if' '(' expression ')' '{' statements '}'

whileStatement: 'while' '(' expression ')' '{' statements '}'

letStatement: 'let' varName '=' expression ';'

expression: term (op term)?

term: varName | constant

varName: a string not beginning with a digit

constant: a decimal number

op: '+' | '-' | '=' | '>' | '<'

Notes:
* = 0 or more
? = 0 or 1
| = choice
() = grouping
'xxx' = terminals
xxx = non-terminals
```

Parser for Jack:
- One method for each non-terminal rule
- Class/module CompilationEngine
    - compileStatements
    - compileIfStatement
    - compileWhileStatement
- Input is already tokenized
- Logic
    - Follow the right-hand side of a rule and parse the input accordingly
    - If the right-hand side specifies a non-terminal rule, call compileXXX
    - Do this recursively
- Program: JackAnalyzer 
    - Uses JackTockenizer and CompilationEngine
    - Produces XML syntax tree
    - Input: filename.jack or directory
    - Output: filename.xml for input file or for each .jack file in the given directory

- LL grammar (Left-to-right, Leftmost derivation)
- Jack is a LL(1) grammar except for determining if an identifier is a simple variable, an array , a function call or an object reference. Because of this, Jack becomes an LL(2) grammar language.

## Jack grammar (complete)

Lexical elements

```
keyword:
'class' | 'constructor |' 'method' | 'function' | 'int |' 'boolean' | 'char' | 'void' | 'var |' 'static' | 'field' | 'let' | 'do |' 'if' | 'else' | 'while' | 'return' | 'true' | 'false' | 'null' | 'this'

symbol: '{' | '}' | '(' | ')' | '[' | ']' | '.' | ',' | ';' | '+' | '-' | '*' | '/ |' '&' | '|' | '<' | '>' | '=' | '~'

integerConstant: a decimal number 0..32767

StringConstant: '"' a sequence of characters except for double-quote and newline '"'

identifier: a sequence of letters, digits and underscore not starting with a digit
```

Program structure

```
class: 'class' className '{' classVarDec* subroutindeDec* '}'

classVarDec: ('static' | 'field') type varName (',' varName)* ';'
type: 'int' | 'char' | 'boolean' | className

subroutineDec: ('constructor' | 'function' | 'method') ('void' | type) subroutineName '(' parameterList ')' subroutineBody

parameterList: ((type varName) (',' type varName)*)?

subroutineBody: '{' varDec* statements '}'
varDec: 'var' type varName (',' varName)* ';'

className: identifier

subroutineName: identifier

varName: identifier
```

Statements

```
statements: statement*

statement: letStatement | ifStatement | whileStatement | doStatement | returnStatement

letStatement: 'let' varName ('[' expression ']')? '=' expression ';'

ifStatement: 'if' '(' expression ')' '{' statements '}' ( 'else' '{' statements '})?

whileStatement: 'while' '(' expression ')' '{' statements '}'

doStatement: 'do' subroutineCall ';'

returnStatement: 'return' expression? ';'
```

Expressions

```
expression: term (op term)*

term: integerConstant | stringConstant | keywordConstant | varName | varName '[' expression ']' | subroutineCall | '(' expression ')' | unaryOp term

subroutineCall: subroutineName '(' expressionList ')' | (className|varName) '.' subroutineName '(' expressionList ')'

expressionList: (expression (',' expression)*)?

varName: a string not beginning with a digit

op: '+' | '-' | '*' | '/' | '=' | '>' | '<'

unaryOP: '-' | '~'

keywordConstant: 'true' | 'false' | 'null' | 'this'
```
