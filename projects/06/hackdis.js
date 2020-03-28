const fs = require('fs');
const path = require('path');
const hacklib = require('./hacklib.js');

// TODO: Handle command line errors
const infile = process.argv[2];
const outfile = path.join(path.dirname(infile), path.basename(infile, path.extname(infile)) + '_dis.asm');

fs.readFile(infile, 'utf8', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        const out = hacklib.disasm(data.replace(/\r\n/g, '\n'));
        fs.writeFile(outfile, out, function (err) {
            if (err) {
                console.error(err);
            }
        });
    }
});
