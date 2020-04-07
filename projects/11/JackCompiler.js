const fs = require('fs');
const path = require('path');
const JackTokenizer = require('./JackTokenizer.js');
const CompilationEngine = require('./CompilationEngine.js');

const readpath = process.argv[2];
const syntax = process.argv[3] || '';
const stat = fs.statSync(readpath);

function analyzeFile(filepath) {
    console.log('  Compiling file ' + filepath);
    const syntaxFile = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.xml');
    const data = fs.readFileSync(filepath, 'utf8');
    const tokenizer = new JackTokenizer(data);
    const engine = new CompilationEngine(tokenizer);
    try {
        engine.compileClass();
        if (syntax == '-s') {
            fs.writeFileSync(syntaxFile, engine.getSyntaxTree(), 'utf8');
            console.log('  > Written syntax analysis to file ' + syntaxFile);
        }
    } catch (e) {
        const pos = tokenizer.getPos();
        console.error(`Error at line ${pos.line}, position ${pos.col}: ${e.message}`);
    }
}

if (stat.isDirectory()) {
    console.log('Processing directory ' + readpath);
    const files = fs.readdirSync(readpath).filter(f => path.extname(f) == '.jack');

    files.forEach(function (file) {
        const filepath = path.join(readpath, file);
        analyzeFile(filepath);
    });
} else {
    analyzeFile(readpath);
}
