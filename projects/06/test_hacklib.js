const hacklib = require('./hacklib.js');

const tests = [
    { bin: '0000000000000000', asm: '@0'},
    { bin: '0000000000000001', asm: '@1'},
    { bin: '0000000000000010', asm: '@2'},
    { bin: '0000000000000011', asm: '@3'},
    { bin: '0000000000100000', asm: '@32'},
    { bin: '0100000000000000', asm: '@16384'},
    { bin: '1110000010010000', asm: 'D=D+A'},
    { bin: '1110001100000001', asm: 'D;JGT'},
    { bin: '1110001100000110', asm: 'D;JLE'},
    { bin: '1110001100001000', asm: 'M=D'},
    { bin: '1110101010000111', asm: '0;JMP'},
    { bin: '1110110000010000', asm: 'D=A'},
    { bin: '1110111010001000', asm: 'M=-1'},
    { bin: '1111010011010000', asm: 'D=D-M'},
    { bin: '1111110000010000', asm: 'D=M'},
    { bin: '1111110000100000', asm: 'A=M'},
    { bin: '1111110010011000', asm: 'MD=M-1'}
];

tests.forEach(function (test, i) {
    var asm = hacklib.bin2asm(test.bin);
    var bin = hacklib.asm2bin(test.asm);
    console.log('i:', i, 'asm2bin:', bin == test.bin ? 'pass' : 'FAIL', 'bin2asm:', asm == test.asm ? 'pass' : 'FAIL');
    if (bin != test.bin) {
        console.log('src:', test.asm, 'expect:', test.bin, 'got:', bin);
    }
    if (asm != test.asm) {
        console.log('src:', test.bin, 'expect:', test.asm, 'got:', asm);
    }
    //console.log(bin);
})

const source = '@2\nD=A\n@3\nD=D+A\n@0\nM=D';
const bin = hacklib.asm(source);
const asm = hacklib.disasm(bin);

console.log('asm & disasm: ', source == asm ? 'pass' : 'FAIL');

// TODO: create more tests
