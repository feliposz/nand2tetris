class SymbolTable {
    constructor() {
        this.symbols = {};
        this.indexSeq = {static: 0, field: 0, argument: 0, local: 0};
    }

    nextIndex(kind) {
        return this.indexSeq[kind]++;
    }

    define(name, type, kind) {
        const index = this.nextIndex(kind);
        this.symbols[name] = {type, kind, index};
        return index;
    }

    startSubroutine() {
        this.symbols = {};
        this.indexSeq.argument = 0;
        this.indexSeq.local = 0;
    }

    numKind(kind) {
        return this.indexSeq[kind];
    }

    kindOf(name) {
        if (name in this.symbols) {
            return this.symbols[name].kind;
        } else {
            return null;
        }
    }

    typeOf(name) {
        if (name in this.symbols) {
            return this.symbols[name].type;
        } else {
            return null;
        }
    }

    indexOf(name) {
        if (name in this.symbols) {
            return this.symbols[name].index;
        } else {
            return null;
        }
    }
};

module.exports = SymbolTable;