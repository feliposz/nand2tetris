const fs = require('fs');
const path = require('path');
const vmlib = require('./vmlib.js');

// TODO: Handle command line errors
const readpath = process.argv[2];
const addBoostrap = process.argv[3] || 'y';
const basename = path.basename(readpath, path.extname(readpath));
const stat = fs.statSync(readpath);

var writefile = '';
var out = [];

if (addBoostrap == 'y') {
    console.log('Bootstrap code added')
    out.push(vmlib.codeBoot());
}

try {
    if (stat.isDirectory()) {
        
        console.log('Processing directory ' + readpath);
        writefile =  path.join(readpath, basename + '.asm');
        const files = fs.readdirSync(readpath).filter(f => path.extname(f) == '.vm');

        files.forEach(function (file) {
            const filepath = path.join(readpath, file);
            console.log('Translating file ' + filepath);

            const data = fs.readFileSync(filepath, 'utf8');
            vmlib.basename = path.basename(file, path.extname(file));
            out.push(vmlib.main(data.replace(/\r\n/g, '\n')));
        });

    } else {

        writefile =  path.join(path.dirname(readpath), basename + '.asm');
        console.log('Translating ' + readpath);

        const data = fs.readFileSync(readpath, 'utf8');
        vmlib.basename = basename;
        out.push(vmlib.main(data.replace(/\r\n/g, '\n')));
    }

    console.log('Writing output to ' + writefile);
    fs.writeFileSync(writefile, out.join('\n'));

} catch (err) {
    console.error(err.message);
}