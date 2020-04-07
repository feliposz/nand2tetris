const SymbolTable = require('./SymbolTable.js');

class CompilationEngine {

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.tokenizer.advance();
        this.syntaxTree = [];
        this.classTable = new SymbolTable();
        this.localTable = new SymbolTable();
    }

    getSyntaxTree() {
        return this.syntaxTree.join('\n');
    }

    open(tag) {
        this.syntaxTree.push(`<${tag}>`);
    }

    close(tag) {
        this.syntaxTree.push(`</${tag}>`);
    }

    append(tag, content) {
        if (tag == 'symbol') {
            if (content == '&') {
                content = '&amp;';
            } else if (content == '<') {
                content = '&lt;';
            } else if (content == '>') {
                content = '&gt;';
            }
        }
        this.syntaxTree.push(`<${tag}> ${content} </${tag}>`);
    }

    appendDefineVar(name, type, kind, index) {
        this.append('defineVar', `name: ${name}, type: ${type}, kind: ${kind}, index: ${index}`);
    }

    appendUseVar(name) {
        const type = this.localTable.typeOf(name),
              kind = this.localTable.kindOf(name),
              index = this.localTable.indexOf(name);
        if (kind) {
            this.append('useVar', `name: ${name}, type: ${type}, kind: ${kind}, index: ${index}`);
        } else {
            const type = this.classTable.typeOf(name),
                  kind = this.classTable.kindOf(name),
                  index = this.classTable.indexOf(name);
            if (kind) {
                this.append('useVar', `name: ${name}, type: ${type}, kind: ${kind}, index: ${index}`);
            }
        }
    }

    keyword(str) {
        if (this.tokenizer.getType() == 'keyword') {
            if (this.tokenizer.getValue() == str) {
                this.append('keyword', str);
                this.tokenizer.advance();
                return;
            }
        }
        throw new Error(`Expected keyword ${str}`);
    }

    identifier(type) {
        if (this.tokenizer.getType() == 'identifier') {
            this.append('identifier', this.tokenizer.getValue());
            this.tokenizer.advance();
            return;
        }
        throw new Error(`Expected ${type} (got: ${this.tokenizer.getType()})`);
    }

    symbol(str) {
        if (this.tokenizer.getType() == 'symbol') {
            if (this.tokenizer.getValue() == str) {
                this.append('symbol', str);
                this.tokenizer.advance();
                return;
            }
        }
        throw new Error(`Expected symbol ${str}`);
    }

    stringConstant() {
        if (this.tokenizer.getType() == 'stringConstant') {
            this.append('stringConstant', this.tokenizer.getValue());
            this.tokenizer.advance();
            return;
        }
        throw new Error(`Expected string constant`);
    }

    integerConstant() {
        if (this.tokenizer.getType() == 'integerConstant') {
            this.append('integerConstant', this.tokenizer.getValue());
            this.tokenizer.advance();
            return;
        }
        throw new Error(`Expected integer constant`);
    }

    compileClass() {
        this.open('class');
        this.keyword('class');
        this.identifier('className');
        this.symbol('{');
        this.compileClassVarDec();
        this.compileSubroutineDec();
        this.symbol('}');
        this.close('class');
        if (this.tokenizer.hasMoreTokens()) {
            throw new Error('Only one class definition per file is allowed');
        }
    }

    compileClassVarDec() {
        while (this.tokenizer.hasMoreTokens()) {
            const kind = this.tokenizer.getValue();
            if (this.tokenizer.getValue() == 'static') {
                this.open('classVarDec');
                this.keyword('static');
            } else if (this.tokenizer.getValue() == 'field') {
                this.open('classVarDec');
                this.keyword('field');
            } else {
                break;
            }
            const type = this.tokenizer.getValue();
            if (this.tokenizer.getValue() == 'int') {
                this.keyword('int');
            } else if (this.tokenizer.getValue() == 'char') {
                this.keyword('char');
            } else if (this.tokenizer.getValue() == 'boolean') {
                this.keyword('boolean');
            } else {
                this.identifier('className');
            }
            while (this.tokenizer.hasMoreTokens()) {
                const name = this.tokenizer.getValue();
                this.identifier();
                const index = this.classTable.define(name, type, kind);
                this.appendDefineVar(name, type, kind, index);
                if (this.tokenizer.getValue() == ',') {
                    this.symbol(',');
                } else if (this.tokenizer.getValue() == ';') {
                    this.symbol(';');
                    break;
                } else {
                    throw new Error('Expected symbol , or ;');
                }
            }
            this.close('classVarDec');
        }
    }

    compileSubroutineDec() {
        while (this.tokenizer.hasMoreTokens()) {
            if (this.tokenizer.getValue() == 'constructor') {
                this.open('subroutineDec');
                this.keyword('constructor');
            } else if (this.tokenizer.getValue() == 'function') {
                this.open('subroutineDec');
                this.keyword('function');
            } else if (this.tokenizer.getValue() == 'method') {
                this.open('subroutineDec');
                this.keyword('method');
            } else {
                break;
            }
            if (this.tokenizer.getValue() == 'void') {
                this.keyword('void');
            } else if (this.tokenizer.getValue() == 'int') {
                this.keyword('int');
            } else if (this.tokenizer.getValue() == 'char') {
                this.keyword('char');
            } else if (this.tokenizer.getValue() == 'boolean') {
                this.keyword('boolean');
            } else {
                this.identifier('className');
            }
            this.identifier('subroutineName');
            this.localTable.startSubroutine();
            this.symbol('(');
            this.compileParameterList();
            this.symbol(')');
            this.compileSubroutineBody();
            this.close('subroutineDec');
        }
    }

    compileParameterList() {
        this.open('parameterList');
        while (this.tokenizer.hasMoreTokens()) {
            const type = this.tokenizer.getValue();
            if (this.tokenizer.getValue() == 'int') {
                this.keyword('int');
            } else if (this.tokenizer.getValue() == 'char') {
                this.keyword('char');
            } else if (this.tokenizer.getValue() == 'boolean') {
                this.keyword('boolean');
            } else if (this.tokenizer.getType() == 'identifier') {
                this.identifier('className');
            } else {
                break;
            }
            const name = this.tokenizer.getValue();
            const kind = 'argument';
            this.identifier('varName');
            const index = this.localTable.define(name, type, kind);
            this.appendDefineVar(name, type, kind, index);
            if (this.tokenizer.getValue() == ',') {
                this.symbol(',');
            } else {
                break;
            }
        }
        this.close('parameterList');
    }

    compileSubroutineBody() {
        this.open('subroutineBody');
        this.symbol('{');
        this.compileVarDec();
        this.compileStatements();
        this.symbol('}');
        this.close('subroutineBody');
    }

    compileVarDec() {
        while (this.tokenizer.hasMoreTokens()) {
            if (this.tokenizer.getValue() == 'var') {
                this.open('varDec');
                this.keyword('var');
                const type = this.tokenizer.getValue();
                if (this.tokenizer.getValue() == 'int') {
                    this.keyword('int');
                } else if (this.tokenizer.getValue() == 'char') {
                    this.keyword('char');
                } else if (this.tokenizer.getValue() == 'boolean') {
                    this.keyword('boolean');
                } else {
                    this.identifier('className');
                }
                while (this.tokenizer.hasMoreTokens()) {
                    const name = this.tokenizer.getValue();
                    const kind = 'local';
                    this.identifier("varName");
                    const index = this.localTable.define(name, type, kind);
                    this.appendDefineVar(name, type, kind, index);
                    if (this.tokenizer.getValue() == ',') {
                        this.symbol(',');
                    } else if (this.tokenizer.getValue() == ';') {
                        this.symbol(';');
                        break;
                    } else {
                        throw new Error('Expected symbol , or ;');
                    }
                }
                this.close('varDec');
            } else {
                break;
            }
        }
    }

    compileStatements() {
        this.open('statements');
        while (this.tokenizer.hasMoreTokens()) {
            if (this.tokenizer.getValue() == 'let') {
                this.compileLetStatement();
            } else if (this.tokenizer.getValue() == 'if') {
                this.compileIfStatement();
            } else if (this.tokenizer.getValue() == 'while') {
                this.compileWhileStatement();
            } else if (this.tokenizer.getValue() == 'do') {
                this.compileDoStatement();
            } else if (this.tokenizer.getValue() == 'return') {
                this.compileReturnStatement();
            } else if (this.tokenizer.getValue() == '}') {
                break;
            } else {
                throw new Error('Expected let, if, while, do or }');
            }
        }
        this.close('statements');
    }

    compileLetStatement() {
        this.open('letStatement');
        this.keyword('let');
        const name = this.tokenizer.getValue();
        this.identifier('varName');
        this.appendUseVar(name);
        if (this.tokenizer.getValue() == '[') {
            this.symbol('[');
            this.compileExpression();
            this.symbol(']');
        }
        this.symbol('=');
        this.compileExpression();
        this.symbol(';');
        this.close('letStatement');
    }

    compileWhileStatement() {
        this.open('whileStatement');
        this.keyword('while');
        this.symbol('(');
        this.compileExpression();
        this.symbol(')');
        this.symbol('{');
        this.compileStatements();
        this.symbol('}');
        this.close('whileStatement');
    }

    compileIfStatement() {
        this.open('ifStatement');
        this.keyword('if');
        this.symbol('(');
        this.compileExpression();
        this.symbol(')');
        this.symbol('{');
        this.compileStatements();
        this.symbol('}');
        if (this.tokenizer.getValue() == 'else') {
            this.keyword('else');
            this.symbol('{');
            this.compileStatements();
            this.symbol('}');
        }
        this.close('ifStatement');
    }

    compileDoStatement() {
        this.open('doStatement');
        this.keyword('do');
        this.compileSubroutineCall();
        this.symbol(';');
        this.close('doStatement');
    }

    compileReturnStatement() {
        this.open('returnStatement');
        this.keyword('return');
        if (this.tokenizer.getValue() != ';') {
            this.compileExpression();
        }
        this.symbol(';');
        this.close('returnStatement');
    }

    compileSubroutineCall(lookahead) {
        if (lookahead) {
            this.append('identifier', lookahead);
        } else {
            const name = this.tokenizer.getValue();
            this.identifier('name');
            this.appendUseVar(name);
        }
        if (this.tokenizer.getValue() == '.') {
            this.symbol('.');
            this.identifier('subroutineName');
        }
        this.symbol('(');
        this.compileExpressionList();
        this.symbol(')');
    }

    compileExpression() {
        this.open('expression');
        while (this.tokenizer.hasMoreTokens()) {
            this.compileTerm();
            if (this.tokenizer.getValue() == '+') {
                this.symbol('+');
            } else if (this.tokenizer.getValue() == '-') {
                this.symbol('-');
            } else if (this.tokenizer.getValue() == '*') {
                this.symbol('*');
            } else if (this.tokenizer.getValue() == '/') {
                this.symbol('/');
            } else if (this.tokenizer.getValue() == '&') {
                this.symbol('&');
            } else if (this.tokenizer.getValue() == '|') {
                this.symbol('|');
            } else if (this.tokenizer.getValue() == '=') {
                this.symbol('=');
            } else if (this.tokenizer.getValue() == '<') {
                this.symbol('<');
            } else if (this.tokenizer.getValue() == '>') {
                this.symbol('>');
            } else {
                break;
            }
        }
        this.close('expression');
    }

    compileExpressionList() {
        this.open('expressionList');
        while (this.tokenizer.hasMoreTokens()) {
            if (this.tokenizer.getValue() == ')') {
                break;
            }
            this.compileExpression();
            if (this.tokenizer.getValue() == ',') {
                this.symbol(',');
            } else {
                break;
            }
        }
        this.close('expressionList');
    }

    compileTerm() {
        this.open('term');
        if (this.tokenizer.getValue() == 'true') {
            this.keyword('true');
        } else if (this.tokenizer.getValue() == 'false') {
            this.keyword('false');
        } else if (this.tokenizer.getValue() == 'null') {
            this.keyword('null');
        } else if (this.tokenizer.getValue() == 'this') {
            this.keyword('this');
        } else if (this.tokenizer.getValue() == '-') {
            this.symbol('-');
            this.compileTerm();
        } else if (this.tokenizer.getValue() == '~') {
            this.symbol('~');
            this.compileTerm();
        } else if (this.tokenizer.getValue() == '(') {
            this.symbol('(');
            this.compileExpression();
            this.symbol(')');
        } else if (this.tokenizer.getType() == 'integerConstant') {
            this.integerConstant();
        } else if (this.tokenizer.getType() == 'stringConstant') {
            this.stringConstant();
        } else {
            if (this.tokenizer.getType() == 'identifier') {
                const lookahead = this.tokenizer.getValue();
                this.tokenizer.advance();
                this.appendUseVar(lookahead);
                if (this.tokenizer.getValue() == '[') {
                    this.append('identifier', lookahead);
                    this.symbol('[');
                    this.compileExpression();
                    this.symbol(']');
                } else if (this.tokenizer.getValue() == '(') {
                    this.compileSubroutineCall(lookahead);
                } else if (this.tokenizer.getValue() == '.') {
                    this.compileSubroutineCall(lookahead);
                } else {
                    this.append('identifier', lookahead);
                }
            } else {
                throw new Error('Expected integer, string, subroutine call, expression or identifier')
            }
        }
        this.close('term');
    }

};

module.exports = CompilationEngine;