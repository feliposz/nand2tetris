const fs = require('fs');

const reservedKeywords = [
    'class', 'constructor', 'function', 'method',
    'field', 'var', 'static',
    'int', 'boolean', 'char', 'void',
    'if', 'else', 'while', 'do', 'let', 'return',
    'true', 'false', 'null', 'this'
];

class JackTokenizer {

    constructor(data) {
        this.data = data;
        this.pos = 0;
        this.type = null;
        this.value = null;
        this.line = 1;
        this.linePos = 0;
    }

    hasMoreTokens() {
        return this.pos < this.data.length;
    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

    getPos() {
        return {line: this.line, col: this.pos - this.linePos};
    }

    advance() {
        let lineComment = false, blockComment = false, inString = false;
        let i = this.pos;
        const len = this.data.length;
        while (i < len) {
            const cur = this.data[i];
            const next = i+1 < len ? this.data[i+1] : '';
            if (cur == '\n') {
                this.line++;
                this.linePos = i;
            }
            if (lineComment) {
                if (cur == '\n') {
                    lineComment = false;
                }
                i++;
            } else if (blockComment) {
                if (cur == '*' && next == '/') {
                    blockComment = false;
                    i++;
                }
                i++;
            } else if (inString) {
                if (cur == '"') {
                    inString = false;
                    i++;
                    break;
                } else if (cur == '\n') {
                    throw Error('String constant not terminated.');
                } else {
                    this.value += cur;
                    i++;
                }
            } else if (cur == '/' && next == '/') {
                lineComment = true;
                i += 2;
            } else if (cur == '/' && next == '*') {
                blockComment = true;
                i += 2;
            } else if (cur == '"') {
                inString = true;
                this.type = 'stringConstant';
                this.value = '';
                i++;
            } else if ('+-*/&|~<>=.,;()[]{}'.indexOf(cur) >= 0) {
                this.type = 'symbol';
                this.value = cur;
                i++;
                break;
            } else if (/[A-Za-z_]/.test(cur)) {
                this.type = 'identifier';
                this.value = '';
                while (i < len) {
                    const c = this.data[i];
                    if (/[A-Za-z_0-9]/.test(c)) {
                        this.value += c;
                        i++;
                    } else {
                        break;
                    }
                }
                if (reservedKeywords.indexOf(this.value) >= 0) {
                    this.type = 'keyword';
                }
                break;
            } else if (/[0-9]/.test(cur)) {
                this.type = 'integerConstant';
                this.value = '';
                while (i < len) {
                    const c = this.data[i];
                    if (/[0-9]/.test(c)) {
                        this.value += c;
                        i++;
                    } else {
                        break;
                    }
                }
                if (this.value == '') {
                    this.value = 0;
                } else {
                    this.value = parseInt(this.value, 10);
                }
                if (isNaN(this.value)) {
                    throw new Error('Invalid integer constant');
                }
                if (this.value < 0 || this.value > 32767) {
                    throw new Error('Invalid integer constant (should be 0-32767)');
                }
                break;
            } else if (/[ \t\r\n]/.test(cur)) {
                i++;
            } else {
                throw new Error('Invalid input: character code ' + cur.charCodeAt(0) + '.');
            }
        }
        this.pos = i;
    }

};

module.exports = JackTokenizer;