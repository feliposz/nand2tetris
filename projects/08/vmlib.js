const vmlib = {

    basename: '',
    jumpAddress: 0,
    currentLine: 0,

    main: function(text) {
        const lines = vmlib.getLines(text);
        const out = vmlib.translateLines(lines);
        return out.join('\n');
    },

    getLines: function (text) {
        // TODO: remove inline comments
        return text.split('\n')
            .map(s => s.replace(/\/\/.*$/g, '')) // remove line comments
            .map(s => s.replace(/ +/g, ' ')) // remove repeated spaces
            .map(s => s.trim());
    },

    parseCommand: function (line) {
        const parts = line.split(' ');
        if (parts.length < 1) {
            throw new Error('Empty command on line ' + vmlib.currentLine);
        } else if (parts[0] == 'push' || parts[0] == 'pop') {
            if (parts.length != 3) {
                throw new Error('Missing argument for ' + parts[0] + ' on line ' + vmlib.currentLine + ' (expected 2)');
            }
        } else if (parts.length != 1) {
            throw new Error('Too many argument for ' + parts[0] + ' on line ' + vmlib.currentLine + ' (expected none)');
        }
        return {cmd: parts[0], arg1: parts[1], arg2: parseInt(parts[2], 10)};
    },

    translateLines: function(lines) {
        const out = [];
        lines.forEach(function (line, lineNum) {
            vmlib.currentLine = lineNum + 1;
            if (line.length > 0) {
                const parsed = vmlib.parseCommand(line);
                out.push('// '+ line);
                switch (parsed.cmd) {
                    case 'push':
                        out.push(vmlib.codePush(parsed.arg1, parsed.arg2));
                        break;
                    case 'pop':
                        out.push(vmlib.codePop(parsed.arg1, parsed.arg2));
                        break;
                    case 'add':
                        out.push(vmlib.codeAdd());
                        break;
                    case 'sub':
                        out.push(vmlib.codeSub());
                        break;
                    case 'neg':
                        out.push(vmlib.codeNeg());
                        break;
                    case 'and':
                        out.push(vmlib.codeAnd());
                        break;
                    case 'or':
                        out.push(vmlib.codeOr());
                        break;
                    case 'not':
                        out.push(vmlib.codeNot());
                        break;
                    case 'eq':
                        out.push(vmlib.codeEq());
                        break;
                    case 'gt':
                        out.push(vmlib.codeGt());
                        break;
                    case 'lt':
                        out.push(vmlib.codeLt());
                        break;
                    default:
                        throw new Error('Invalid command "' + parsed.cmd + '" on line ' + vmlib.currentLine);
                }
            }
        });
        return out;
    },

    codePush: function(segment, i) {
        if (isNaN(i)) {
            throw new Error('Invalid number on push ' + segment + ' on line ' + vmlib.currentLine);
        }
        switch(segment) {
            case 'local':
                return vmlib.codePushIndirect('LCL', i);
            case 'argument':
                return vmlib.codePushIndirect('ARG', i);
            case 'this':
                return vmlib.codePushIndirect('THIS', i);
            case 'that':
                return vmlib.codePushIndirect('THAT', i);
            case 'constant':
                return vmlib.codePushDirect(i, true);
            case 'static':
                return vmlib.codePushDirect(vmlib.basename + '.' + i, false);
            case 'temp':
                return vmlib.codePushDirect(5 + i, false);
            case 'pointer':
                return vmlib.codePushDirect(['THIS', 'THAT'][i], false);
            default:
                throw new Error('Invalid push segment ' + segment + ' on line ' + vmlib.currentLine);
        }
    },

    codePop: function(segment, i) {
        if (isNaN(i)) {
            throw new Error('Invalid number on push ' + segment  + ' on line ' + vmlib.currentLine);
        }
        switch(segment) {
            case 'local':
                return vmlib.codePopIndirect('LCL', i);
            case 'argument':
                return vmlib.codePopIndirect('ARG', i);
            case 'this':
                return vmlib.codePopIndirect('THIS', i);
            case 'that':
                return vmlib.codePopIndirect('THAT', i);
            case 'static':
                return vmlib.codePopDirect(vmlib.basename + '.' + i);
            case 'temp':
                return vmlib.codePopDirect(5 + i);
            case 'pointer':
                return vmlib.codePopDirect(['THIS', 'THAT'][i]);
            default:
                throw new Error('Invalid pop segment ' + segment + ' on line ' + vmlib.currentLine);
            }
    },

    codeAdd: function() {
        return vmlib.codeBinaryOp('D=D+M').join('\n');
    },

    codeSub: function() {
        return vmlib.codeBinaryOp('D=M-D').join('\n');
    },

    codeNeg: function() {
        return vmlib.codeUnaryOp('M=-M').join('\n');
    },

    codeAnd: function() {
        return vmlib.codeBinaryOp('D=D&M').join('\n');
    },

    codeOr: function() {
        return vmlib.codeBinaryOp('D=D|M').join('\n');
    },

    codeNot: function() {
        return vmlib.codeUnaryOp('M=!M').join('\n');
    },

    codeEq: function() {
        return vmlib.codeLogic('JEQ').join('\n');
    },

    codeGt: function() {
        return vmlib.codeLogic('JGT').join('\n');
    },

    codeLt: function() {
        return vmlib.codeLogic('JLT').join('\n');
    },

    codePushIndirect: function(segment, i) {
        const out = [];
        if (i == 0) {
            out.push('@' + segment);
            out.push('A=M');
        } else if (i == 1) {
            out.push('@' + segment);
            out.push('A=M+1');
        } else {
            out.push('@' + i);
            out.push('D=A');
            out.push('@' + segment);
            out.push('A=D+M');
        }
        out.push('D=M'); // get value using indirect addressing
        out.push('@SP');
        out.push('A=M');
        out.push('M=D');
        out.push('@SP');
        out.push('M=M+1'); // push value to stack
        return out.join('\n');
    },

    codePushDirect: function(address, isConstant) {
        const out = [];
        out.push('@' + address);
        out.push(isConstant ? 'D=A' : 'D=M'); // get value directly
        out.push('@SP');
        out.push('A=M');
        out.push('M=D');
        out.push('@SP');
        out.push('M=M+1'); // push value to stack
        return out.join('\n');
    },

    codePopIndirect: function(segment, i) {
        const out = [];
        if (i == 0) {
            out.push('@' + segment);
            out.push('D=M');
        } else if (i == 1) {
            out.push('@' + segment);
            out.push('D=M+1');
        } else {
            out.push('@' + i);
            out.push('D=A');
            out.push('@' + segment);
            out.push('D=D+M');
        }
        out.push('@R13');
        out.push('M=D'); // save pointer to destination in temp register 13
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M');
        out.push('D=M'); // pop value
        out.push('@R13');
        out.push('A=M');
        out.push('M=D'); // write value to destination pointed by register 13
        return out.join('\n');
    },

    codePopDirect: function(address) {
        const out = [];
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M');
        out.push('D=M'); // pop value
        out.push('@' + address);
        out.push('M=D'); // store in destination
        return out.join('\n');
    },

    codeBinaryOp: function(instruction) {
        const out = [];
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M');
        out.push('D=M'); // pop y
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M'); // pop x
        out.push(instruction)
        out.push('@SP');
        out.push('A=M');
        out.push('M=D');
        out.push('@SP');
        out.push('M=M+1'); // push result
        return out;
    },

    codeUnaryOp: function(instruction) {
        const out = [];
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M'); // pop y
        out.push(instruction);
        out.push('@SP');
        out.push('M=M+1'); // push result
        return out;
    },

    codeLogic: function(compareOp) {
        const out = [];
        const jumpTrue = vmlib.nextJumpAdress(compareOp + '_true');
        const jumpFalse = vmlib.nextJumpAdress(compareOp + '_false');
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M');
        out.push('D=M'); // pop y
        out.push('@SP');
        out.push('M=M-1');
        out.push('A=M'); // pop x
        out.push('D=M-D');
        out.push('@' + jumpTrue);
        out.push('D;' + compareOp); // if x compareOp y then D=1 else D=0
        out.push('@' + jumpFalse);
        out.push('D=0;JMP')
        out.push('(' + jumpTrue + ')');
        out.push('D=-1');
        out.push('(' + jumpFalse + ')');
        out.push('@SP');
        out.push('A=M');
        out.push('M=D');
        out.push('@SP');
        out.push('M=M+1'); // push result
        return out;
    },

    nextJumpAdress: function(label) {
        return vmlib.basename + '.' + label + vmlib.jumpAddress++;
    },
};

module.exports = vmlib;