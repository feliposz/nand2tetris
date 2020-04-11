const vmlib = {

    basename: '',
    functionName: '',
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

    parseCommand: function (line, lineNum) {
        const parts = line.split(' ');
        if (parts.length < 1) {
            throw new Error('Empty command on line ' + lineNum);
        } else if (parts[0] == 'push' || parts[0] == 'pop' || parts[0] == 'call' || parts[0] == 'function') {
            if (parts.length != 3) {
                throw new Error('Missing argument for ' + parts[0] + ' on line ' + lineNum + ' (expected 2)');
            }
        } else if (parts[0] == 'label' || parts[0] == 'goto' || parts[0] == 'if-goto') {
            if (parts.length != 2) {
                throw new Error('Missing argument for ' + parts[0] + ' on line ' + lineNum + ' (expected 1)');
            }
        } else if (parts.length != 1) {
            throw new Error('Too many argument for ' + parts[0] + ' on line ' + lineNum + ' (expected none)');
        }
        return {cmd: parts[0], arg1: parts[1], arg2: parseInt(parts[2], 10)};
    },

    translateLines: function(lines) {
        const out = [];
        lines.forEach(function (line, i) {
            vmlib.currentLine = i + 1;
            if (line.length > 0) {
                const parsed = vmlib.parseCommand(line, vmlib.currentLine);
                const parsedNext = i < lines.length-1 ? vmlib.parseCommand(lines[i+1], vmlib.currentLine+1) : {cmd: ''};

                if (parsed.cmd =='push' && parsedNext.cmd == 'pop') {
                    out.push('// '+ line + ' and ' + lines[i+1] + ' inplace');
                } else {
                    out.push('// '+ line);
                }
                switch (parsed.cmd) {
                    case 'push':
                        if (parsedNext.cmd == 'pop') {
                            out.push(vmlib.codePushAndPop(parsed.arg1, parsed.arg2, parsedNext.arg1, parsedNext.arg2));
                            lines[i+1] = '';
                        } else {
                            out.push(vmlib.codePush(parsed.arg1, parsed.arg2));
                        }
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
                    case 'label':
                        out.push(vmlib.codeLabel(parsed.arg1));
                        break;
                    case 'goto':
                        out.push(vmlib.codeGoto(parsed.arg1));
                        break;
                    case 'if-goto':
                        out.push(vmlib.codeIf(parsed.arg1));
                        break;
                    case 'call':
                        out.push(vmlib.codeCall(parsed.arg1, parsed.arg2));
                        break;
                    case 'function':
                        out.push(vmlib.codeFunction(parsed.arg1, parsed.arg2));
                        break;
                    case 'return':
                        out.push(vmlib.codeReturn());
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

    codePushAndPop: function(segmentPush, iPush, segmentPop, iPop) {
        // Remove redundant push/pop code when applicable
        const pushCode = vmlib.codePush(segmentPush, iPush);
        const popCode = vmlib.codePop(segmentPop, iPop);
        const out = [pushCode, popCode].join('\n')
            .replace('@SP\nAM=M+1\nA=A-1\nM=D\n@SP\nAM=M-1\nD=M\n', '');
        return out;
    },

    codeAdd: function() {
        return vmlib.codeBinaryOp('M=D+M').join('\n');
    },

    codeSub: function() {
        return vmlib.codeBinaryOp('M=M-D').join('\n');
    },

    codeNeg: function() {
        return vmlib.codeUnaryOp('M=-M').join('\n');
    },

    codeAnd: function() {
        return vmlib.codeBinaryOp('M=D&M').join('\n');
    },

    codeOr: function() {
        return vmlib.codeBinaryOp('M=D|M').join('\n');
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
        out.push('AM=M+1');
        out.push('A=A-1');
        out.push('M=D'); // push value to stack
        return out.join('\n');
    },

    codePushDirect: function(address, isConstant) {
        const out = [];
        out.push('@' + address);
        out.push(isConstant ? 'D=A' : 'D=M'); // get value directly
        out.push('@SP');
        out.push('AM=M+1');
        out.push('A=A-1');
        out.push('M=D'); // push value to stack
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
        out.push('AM=M-1');
        out.push('D=M'); // pop value
        out.push('@R13');
        out.push('A=M');
        out.push('M=D'); // write value to destination pointed by register 13
        return out.join('\n');
    },

    codePopDirect: function(address) {
        const out = [];
        out.push('@SP');
        out.push('AM=M-1');
        out.push('D=M'); // pop value
        out.push('@' + address);
        out.push('M=D'); // store in destination
        return out.join('\n');
    },

    codeBinaryOp: function(instruction) {
        const out = [];
        out.push('@SP');
        out.push('AM=M-1');
        out.push('D=M'); // pop y
        out.push('@SP');
        out.push('A=M-1'); // pop x, push result (in-place)
        out.push(instruction)
        return out;
    },

    codeUnaryOp: function(instruction) {
        const out = [];
        out.push('@SP');
        out.push('A=M-1');
        out.push(instruction); // apply directly on top of stack
        return out;
    },

    codeLogic: function(compareOp) {
        const out = [];
        const jumpTrue = vmlib.nextJumpAdress(compareOp + '_true');
        const jumpFalse = vmlib.nextJumpAdress(compareOp + '_false');
        out.push('@SP');
        out.push('AM=M-1');
        out.push('D=M'); // pop y
        out.push('@SP');
        out.push('AM=M-1'); // pop x
        out.push('D=M-D');
        out.push('@' + jumpTrue);
        out.push('D;' + compareOp); // if x compareOp y then D=1 else D=0
        out.push('@' + jumpFalse);
        out.push('D=0;JMP');
        out.push('(' + jumpTrue + ')');
        out.push('D=-1');
        out.push('(' + jumpFalse + ')');
        out.push('@SP');
        out.push('AM=M+1');
        out.push('A=A-1');
        out.push('M=D'); // push result
        return out;
    },

    nextJumpAdress: function(label) {
        return vmlib.basename + '.' + label + vmlib.jumpAddress++;
    },

    codeLabel: function(label) {
        return '(' + vmlib.functionName + '$' + label + ')';
    },

    codeGoto: function(label) {
        const out = [];
        out.push('@' + vmlib.functionName + '$' + label);
        out.push('0;JMP');
        return out.join('\n');
    },

    codeIf: function(label) {
        const out = [];
        out.push('@SP');
        out.push('AM=M-1');
        out.push('D=M');
        out.push('@' + vmlib.functionName + '$' + label);
        out.push('D;JNE');
        return out.join('\n');
    },

    nextReturnAddress: function(label) {
        return label + vmlib.jumpAddress++;
    },

    codeCall: function(functionName, numArgs) {
        const retLabel = vmlib.nextReturnAddress(functionName + '$ret');
        const out = [];

        if (vmlib.altFunction) {
            // Use a single routine to perform CALL
            // passing parameters to it using temporary registers
            // in order to reduce total code size.

            // R13-= saveframe size + numArgs
            out.push('@' + (5 + numArgs));
            out.push('D=A');
            out.push('@R13');
            out.push('M=D');

            // R14 = function address
            out.push('@' + functionName);
            out.push('D=A');
            out.push('@R14');
            out.push('M=D');
            
            // D = return address
            out.push('@' + retLabel);
            out.push('D=A');

            // jump to function
            out.push('@VM$CALL');
            out.push('0;JMP');

            // label to return
            out.push('(' + retLabel + ')');
        } else {
            // push return address
            out.push('@' + retLabel);
            out.push('D=A');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');

            // save frame (LCL, ARG, THIS, THAT)
            out.push('@LCL');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');
            out.push('@ARG');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');
            out.push('@THIS');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');
            out.push('@THAT');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');

            // set ARG = SP - 5 - numArgs
            out.push('@' + (5 + numArgs));
            out.push('D=A');
            out.push('@SP');
            out.push('D=M-D');
            out.push('@ARG');
            out.push('M=D');

            // jump to function
            out.push('@' + functionName);
            out.push('0;JMP');

            // label to return
            out.push('(' + retLabel + ')');
        }
        return out.join('\n');
    },

    codeFunction: function(functionName, numLocals) {
        const out = [];
        vmlib.functionName = functionName;
        out.push('(' + functionName + ')');
        // set LCL
        out.push('@SP');
        out.push('D=M');
        out.push('@LCL');
        out.push('M=D');
        // push 0 * numLocals times
        for (var i = 0; i < numLocals; i++) {
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=0');
        }
        return out.join('\n');
    },

    codeReturn: function() {
        const out = [];

        if (vmlib.altFunction) {
            // jump to retAddr
            out.push('@VM$RETURN');
            out.push('0;JMP');
        } else {
            // save retAddr to R13
            out.push('@5');
            out.push('D=A')
            out.push('@LCL');
            out.push('A=M-D');
            out.push('D=M');
            out.push('@R13');
            out.push('M=D');

            // ARG[0] = pop return value
            out.push('@SP');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@ARG');
            out.push('A=M');
            out.push('M=D');
            // set SP to caller value
            out.push('D=A'); // A still pointing to ARG[0]
            out.push('@SP');
            out.push('M=D+1'); // +1 = to fake "push" return value

            // save endFrame to R14
            out.push('@LCL');
            out.push('D=M');
            out.push('@R14');
            out.push('AM=D-1');

            // restore frame
            out.push('D=M');
            out.push('@THAT');
            out.push('M=D');

            out.push('@R14');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@THIS');
            out.push('M=D');

            out.push('@R14');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@ARG');
            out.push('M=D');

            out.push('@R14');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@LCL');
            out.push('M=D');

            // jump to retAddr
            out.push('@R13');
            out.push('A=M');
            out.push('0;JMP');
        }
        return out.join('\n');
    },

    codeBoot: function(altFunction) {
        const out = [];
        vmlib.altFunction = altFunction;
        out.push('@256');
        out.push('D=A');
        out.push('@SP');
        out.push('M=D');
        out.push(vmlib.codeCall('Sys.init', 0));
        if (altFunction) {

            // Sentinel
            out.push('(VM$STOP)');
            out.push('@VM$STOP');
            out.push('0;JMP');

            // Common routine to call procedure
            out.push('(VM$CALL)');

            // push return address (D)
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D'); 

            // save frame
            out.push('@LCL');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');
            out.push('@ARG');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');
            out.push('@THIS');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');
            out.push('@THAT');
            out.push('D=M');
            out.push('@SP');
            out.push('AM=M+1');
            out.push('A=A-1');
            out.push('M=D');

            // framesize + numArgs
            out.push('@R13');
            out.push('D=M');
            out.push('@SP');
            out.push('D=M-D');
            out.push('@ARG');
            out.push('M=D');

            // call address
            out.push('@R14');
            out.push('A=M');
            out.push('0;JMP');

            // Common routine to return from procedure
            out.push('(VM$RETURN)');
            // save retAddr to R13
            out.push('@5');
            out.push('D=A')
            out.push('@LCL');
            out.push('A=M-D');
            out.push('D=M');
            out.push('@R13');
            out.push('M=D');

            // ARG[0] = pop return value
            out.push('@SP');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@ARG');
            out.push('A=M');
            out.push('M=D');
            // set SP to caller value
            out.push('D=A'); // A still pointing to ARG[0]
            out.push('@SP');
            out.push('M=D+1'); // +1 = to fake "push" return value

            // save endFrame to R14
            out.push('@LCL');
            out.push('D=M');
            out.push('@R14');
            out.push('AM=D-1');

            // restore frame
            out.push('D=M');
            out.push('@THAT');
            out.push('M=D');

            out.push('@R14');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@THIS');
            out.push('M=D');

            out.push('@R14');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@ARG');
            out.push('M=D');

            out.push('@R14');
            out.push('AM=M-1');
            out.push('D=M');
            out.push('@LCL');
            out.push('M=D');

            // jump to retAddr
            out.push('@R13');
            out.push('A=M');
            out.push('0;JMP');
        }
        return out.join('\n');
    },

};

module.exports = vmlib;