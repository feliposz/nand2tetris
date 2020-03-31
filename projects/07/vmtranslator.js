const fs = require('fs');
const path = require('path');
const vmlib = require('./vmlib.js');

// TODO: Handle command line errors
const infile = process.argv[2];
const basename = path.basename(infile, path.extname(infile));
const outfile = path.join(path.dirname(infile), basename + '.asm');
vmlib.basename = basename;

fs.readFile(infile, 'utf8', function (err, data) {
    if (err) {
        console.error(err.message);
    } else {
        try {
            const out = vmlib.main(data.replace(/\r\n/g, '\n'));
            fs.writeFile(outfile, out, function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
        } catch (e) {
            console.error(e.message);
        }
    }
});
