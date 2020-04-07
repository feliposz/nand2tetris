class VMWriter {

    constructor() {
        this.code = [];
    }

    getCode() {
        return this.code.join('\n');
    }

    writePush(segment, index) {
        this.code.push(`push ${segment} ${index}`);
    }
    
    writePop(segment, index) {
        this.code.push(`pop ${segment} ${index}`);
    }
    
    writeArithmetic(op) {
        switch (op) {
            case '+': this.code.push('add'); break;
            case '-': this.code.push('sub'); break;
            case '*': this.writeCall('Math.multiply', 2); break;
            case '/': this.writeCall('Math.divide', 2); break;
            case '&': this.code.push('and'); break;
            case '|': this.code.push('or'); break;
            case '<': this.code.push('lt'); break;
            case '>': this.code.push('gt'); break;
            case '=': this.code.push('eq'); break;
            case 'neg': this.code.push('neg'); break;
            case 'not': this.code.push('not'); break;
            default: throw new Error("Unknown operation");
        }
    }
    
    writeLabel(label) {
        this.code.push(`label ${label}`);
    }
    
    writeGoto(label) {
        this.code.push(`goto ${label}`);
    }
    
    writeIf(label) {
        this.code.push(`if-goto ${label}`);
    }
    
    writeCall(functionName, numArgs) {
        this.code.push(`call ${functionName} ${numArgs}`);
    }
    
    writeFunction(functionName, numVars) {
        this.code.push(`function ${functionName} ${numVars}`);
    }
    
    writeReturn() {
        this.code.push('return');
    }

};

module.exports = VMWriter;