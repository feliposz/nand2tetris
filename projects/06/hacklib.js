const hacklib = {

    disasm: function (text) {
        // TODO: Report error on invalid input
        const binary = text.split(/\n/).filter(s => /^[01]{16}$/.test(s));
        const asm = binary.map(hacklib.bin2asm);
        return asm.join('\n');
    },

    asm: function (text) {
        // TODO: Report error on invalid input
        const lines = hacklib.getLines(text);
        const pureAsm = hacklib.translateSymbols(lines);
        const binary = pureAsm.map(hacklib.asm2bin);
        return binary.join('\n');
    },

    getLines: function (text) {
        // TODO: remove inline comments
        return text.split('\n')
            .map(s => s.replace(/\/\/.*$/g, '')) // remove line comments
            .map(s => s.replace(/\s/g, '')) // remove spaces
            .filter(s => s.length>0); // remove empty lines
    },

    translateSymbols: function (lines) {
        // Initialize symbol table with predefined symbols
        const symbolTable = {
            'SCREEN': 16384,
            'KBD': 24576,
            'SP': 0,
            'LCL': 1,
            'ARG': 2 ,
            'THIS': 3,
            'THAT': 4
        };
        for (var r = 0; r < 16; r++) {
            symbolTable['R' + r] = r;
        }

        // First pass - scan for jump labels
        var i = 0;
        var first = [];
        lines.forEach(function (line) {
            if (line[0] == '(') {
                //console.log('new label:', line);
                const label = line.substr(1, line.length-2);
                symbolTable[label] = i;
            } else {
                i++;
                first.push(line);
            }
        });

        // Second pass
        var freePos = 16; // start allocating memory after reserved registers (R0-R15)
        const second = first.map(function (line) {
            if (line[0] == '@') {
                const symbol = line.substr(1);
                const value = parseInt(symbol, 10);
                if (!isNaN(value)) {
                    return line;
                }
                if (!(symbol in symbolTable)) {
                    //console.log('new variable:', line);
                    symbolTable[symbol] = freePos++;
                }
                return '@' + symbolTable[symbol];
            } else {
                return line;
            }
        });
        //console.log(symbolTable);
        //console.log(second);
        return second;
    },

    bin2asm: function (bits) {
        if (bits[0] == '0') {
            var value = parseInt(bits.substr(1, 15), 2);
            return '@' + value;
        } else {
            // TODO: Report error on invalid instructions
            var a = bits.substr(3, 1),
                comp = bits.substr(4, 6),
                dest = bits.substr(10, 3),
                jump = bits.substr(13, 3);
            return hacklib.decodeDest[dest] + hacklib.decodeComp[comp].replace('A', a==0?'A':'M') + hacklib.decodeJump[jump];
        }
    },

    asm2bin: function (instruction) {
        var parts = hacklib.parseInstruction(instruction);
        if (parts.type == 'a') {
            var value = parseInt(parts.value, 10);
            var bin = value.toString(2);
            return ('0000000000000000' + bin).substr(bin.length);
        } else {
            //console.log(parts)
            return '111' + hacklib.encodeComp[parts.comp] + hacklib.encodeDest[parts.dest] + hacklib.encodeJump[parts.jump];
        }
    },

    parseInstruction: function (instruction) {
        var dest = '', comp = '', jump = '', value = null, type = '';
        if (instruction.startsWith('@')) {
            type = 'a';
            value = instruction.substr(1);
        } else {
            type = 'c';
            if (instruction.indexOf('=') >= 0) {
                var parts = instruction.split('=');
                dest = parts[0];
                instruction = parts[1];
            }
            if (instruction.indexOf(';') >= 0) {
                var parts = instruction.split(';');
                jump = parts[1];
                instruction = parts[0];
            }
            comp = instruction;
        }
        return {type, value, dest, comp, jump};
    },

    decodeDest: {
        '000': '',
        '001': 'M=',
        '010': 'D=',
        '011': 'MD=',
        '100': 'A=',
        '101': 'AM=',
        '110': 'AD=',
        '111': 'AMD='
    },

    decodeJump: {
        '000': '',
        '001': ';JGT',
        '010': ';JEQ',
        '011': ';JGE',
        '100': ';JLT',
        '101': ';JNE',
        '110': ';JLE',
        '111': ';JMP'
    },

    decodeComp: {
        '101010': '0',
        '111111': '1',
        '111010': '-1',
        '001100': 'D',
        '110000': 'A',
        '001101': '!D',
        '110001': '!A',
        '001111': '-D',
        '110011': '-A',
        '011111': 'D+1',
        '110111': 'A+1',
        '001110': 'D-1',
        '110010': 'A-1',
        '000010': 'D+A',
        '010011': 'D-A',
        '000111': 'A-D',
        '000000': 'D&A',
        '010101': 'D|A'
    },

    encodeDest: {
        '': '000',
        'M': '001',
        'D': '010',
        'MD': '011',
        'A': '100',
        'AM': '101',
        'AD': '110',
        'AMD': '111'
    },

    encodeJump: {
        '': '000',
        'JGT': '001',
        'JEQ': '010',
        'JGE': '011',
        'JLT': '100',
        'JNE': '101',
        'JLE': '110',
        'JMP': '111'
    },

    encodeComp: {
        '0': '0101010',
        '1': '0111111',
        '-1': '0111010',
        'D': '0001100',
        'A': '0110000',
        '!D': '0001101',
        '!A': '0110001',
        '-D': '0001111',
        '-A': '0110011',
        'D+1': '0011111',
        'A+1': '0110111',
        'D-1': '0001110',
        'A-1': '0110010',
        'D+A': '0000010',
        'D-A': '0010011',
        'A-D': '0000111',
        'D&A': '0000000',
        'D|A': '0010101',
        'M': '1110000',
        '!M': '1110001',
        '-M': '1110011',
        'M+1': '1110111',
        'M-1': '1110010',
        'D+M': '1000010',
        'D-M': '1010011',
        'M-D': '1000111',
        'D&M': '1000000',
        'D|M': '1010101'
    }
}

module.exports = hacklib;