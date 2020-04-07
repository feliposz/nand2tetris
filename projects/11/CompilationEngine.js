const SymbolTable = require('./SymbolTable.js');
const VMWriter = require('./VMWriter.js');

class CompilationEngine {

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.tokenizer.advance();
        this.syntaxTree = [];
        this.className = '';
        this.labelSeq = 0;
        this.vm = new VMWriter();
        this.classTable = new SymbolTable();
        this.localTable = new SymbolTable();
    }

    getSyntaxTree() {
        return this.syntaxTree.join('\n');
    }

    getCode() {
        return this.vm.getCode();
    }

    nextLabel(prefix) {
        return prefix + this.labelSeq++;
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
        this.className = this.tokenizer.getValue();
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
            const kind = this.tokenizer.getValue();
            if (kind == 'constructor') {
                this.open('subroutineDec');
                this.keyword('constructor');
            } else if (kind == 'function') {
                this.open('subroutineDec');
                this.keyword('function');
            } else if (kind == 'method') {
                this.open('subroutineDec');
                this.keyword('method');
            } else {
                break;
            }
            const retType = this.tokenizer.getValue();
            if (retType == 'void') {
                this.keyword('void');
            } else if (retType == 'int') {
                this.keyword('int');
            } else if (retType == 'char') {
                this.keyword('char');
            } else if (retType == 'boolean') {
                this.keyword('boolean');
            } else {
                this.identifier('className');
            }
            const name = this.tokenizer.getValue();
            this.identifier('subroutineName');
            this.localTable.startSubroutine();
            this.symbol('(');
            this.compileParameterList();
            this.symbol(')');
            this.compileSubroutineBody(name, kind);
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

    compileSubroutineBody(name, kind) {
        this.open('subroutineBody');
        this.symbol('{');
        this.compileVarDec();
        const numVars = this.localTable.numKind('local') + (kind == 'method' ? 1 : 0);
        this.vm.writeFunction(this.className + '.' + name, numVars);
        if (kind == 'constructor') {
            this.vm.writePush('constant', this.classTable.numKind('field'));
            this.vm.writeCall('Memory.alloc', 1);
            this.vm.writePop('pointer', 0);
        } else if (kind == 'method') {
            this.vm.writePush('argument', 0);
            this.vm.writePop('pointer', 0);
        }
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
        const varName = this.tokenizer.getValue();
        const kind = this.localTable.kindOf(varName) || this.classTable.kindOf(varName);
        const index = this.localTable.indexOf(varName) == null ? this.classTable.indexOf(varName) : this.localTable.indexOf(varName);
        if (kind == null) {
            throw new Error(`Undeclared identifier: ${varName}`);
        }
        this.identifier('varName');
        if (this.tokenizer.getValue() == '[') {
            this.symbol('[');
            this.compileExpression();
            this.symbol(']');
        }
        this.symbol('=');
        this.compileExpression();
        this.symbol(';');
        this.vm.writePop(kind == 'field' ? 'this' : kind, index);
        this.close('letStatement');
    }

    compileWhileStatement() {
        const begin = this.nextLabel('while_begin');
        const end = this.nextLabel('while_end');
        this.open('whileStatement');
        this.keyword('while');
        this.symbol('(');
        this.vm.writeLabel(begin);
        this.compileExpression();
        this.vm.writeArithmetic('not');
        this.vm.writeIf(end);
        this.symbol(')');
        this.symbol('{');
        this.compileStatements();
        this.vm.writeGoto(begin);
        this.symbol('}');
        this.vm.writeLabel(end);
        this.close('whileStatement');
    }

    compileIfStatement() {
        const if_false = this.nextLabel('if_false');
        this.open('ifStatement');
        this.keyword('if');
        this.symbol('(');
        this.compileExpression();
        this.vm.writeArithmetic('not');
        this.vm.writeIf(if_false);
        this.symbol(')');
        this.symbol('{');
        this.compileStatements();
        this.symbol('}');
        if (this.tokenizer.getValue() == 'else') {
            const if_end = this.nextLabel('if_end');
            this.vm.writeGoto(if_end);
            this.vm.writeLabel(if_false);
            this.keyword('else');
            this.symbol('{');
            this.compileStatements();
            this.symbol('}');
            this.vm.writeLabel(if_end);
        } else {
            this.vm.writeLabel(if_false);
        }

        this.close('ifStatement');
    }

    compileDoStatement() {
        this.open('doStatement');
        this.keyword('do');
        this.compileSubroutineCall();
        this.symbol(';');
        this.vm.writePop('temp', 0);
        this.close('doStatement');
    }

    compileReturnStatement() {
        this.open('returnStatement');
        this.keyword('return');
        if (this.tokenizer.getValue() != ';') {
            this.compileExpression();
        } else {
            this.vm.writePush('constant', 0);
        }
        this.symbol(';');
        this.vm.writeReturn();
        this.close('returnStatement');
    }

    compileSubroutineCall(lookahead) {
        let name, functionName, numArgs = 0;
        if (lookahead) {
            this.append('identifier', lookahead);
            name = lookahead;
        } else {
            name = this.tokenizer.getValue();
            this.identifier('name');
            this.appendUseVar(name);
        }
        if (this.tokenizer.getValue() == '.') {
            this.symbol('.');
            if (this.localTable.typeOf(name)) {
                this.vm.writePush(this.localTable.kindOf(name), this.localTable.indexOf(name));
                numArgs = 1;
                name = this.localTable.typeOf(name);
            } else if (this.classTable.typeOf(name)) {
                if (this.classTable.kindOf(name) == 'field') {
                    this.vm.writePush('this', this.classTable.indexOf(name));
                } else {
                    this.vm.writePush('static', this.classTable.indexOf(name));
                }
                numArgs = 1;
                name = this.classTable.typeOf(name);
            }
            functionName = name + '.' + this.tokenizer.getValue();
            this.identifier('subroutineName');
        } else {
            numArgs = 1;
            this.vm.writePush('pointer', 0);
            functionName = this.className + '.' + name;
        }
        this.symbol('(');
        numArgs += this.compileExpressionList();
        this.symbol(')');
        this.vm.writeCall(functionName, numArgs);
    }

    compileExpression() {
        this.open('expression');
        this.compileTerm();
        while (this.tokenizer.hasMoreTokens()) {
            const op = this.tokenizer.getValue();
            if ('+-*/&|=<>'.indexOf(op) >= 0) {
                this.symbol(op); 
                this.compileTerm();
                this.vm.writeArithmetic(op);
            } else {
                break;
            }
        }
        this.close('expression');
    }

    compileExpressionList() {
        let numArgs = 0;
        this.open('expressionList');
        while (this.tokenizer.hasMoreTokens()) {
            if (this.tokenizer.getValue() == ')') {
                break;
            }
            this.compileExpression();
            numArgs++;
            if (this.tokenizer.getValue() == ',') {
                this.symbol(',');
            } else {
                break;
            }
        }
        this.close('expressionList');
        return numArgs;
    }

    compileTerm() {
        this.open('term');
        const token = this.tokenizer.getValue();
        if (token == 'true') {
            this.keyword('true');
            this.vm.writePush('constant', 1);
            this.vm.writeArithmetic('neg');
        } else if (token == 'false') {
            this.keyword('false');
            this.vm.writePush('constant', 0);
        } else if (token == 'null') {
            this.keyword('null');
            this.vm.writePush('constant', 0);
        } else if (token == 'this') {
            this.keyword('this');
            this.vm.writePush('pointer', 0);
        } else if (token == '-') {
            this.symbol('-');
            this.compileTerm();
            this.vm.writeArithmetic('neg');
        } else if (token == '~') {
            this.symbol('~');
            this.compileTerm();
            this.vm.writeArithmetic('not');
        } else if (token == '(') {
            this.symbol('(');
            this.compileExpression();
            this.symbol(')');
        } else if (this.tokenizer.getType() == 'integerConstant') {
            this.integerConstant();
            this.vm.writePush('constant', token);
        } else if (this.tokenizer.getType() == 'stringConstant') {
            this.stringConstant();
        } else {
            if (this.tokenizer.getType() == 'identifier') {
                const lookahead = token;
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
                    const kind = this.localTable.kindOf(lookahead) || this.classTable.kindOf(lookahead);
                    const index = this.localTable.indexOf(lookahead) == null ? this.classTable.indexOf(lookahead) : this.localTable.indexOf(lookahead);
                    if (kind == null) {
                        throw new Error(`Undeclared identifier: ${lookahead}`);
                    }
                    this.vm.writePush(kind == 'field' ? 'this' : kind, index);
                }
            } else {
                throw new Error('Expected integer, string, subroutine call, expression or identifier')
            }
        }
        this.close('term');
    }

};

module.exports = CompilationEngine;