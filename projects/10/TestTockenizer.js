const fs = require('fs');
const path = require('path');
const JackTockenizer = require('./JackTockenizer.js');

const infile = process.argv[2];
const outfile = path.join(path.dirname(infile), path.basename(infile, path.extname(infile)) + 'T.test.xml');
const data = fs.readFileSync(infile, 'utf8');
const jt = new JackTockenizer(data);

const out = [];
out.push('<tokens>');
jt.advance();
while (jt.hasMoreTokens()) {
    out.push('<' + jt.getType() + '> '+ jt.getValue() + ' </' + jt.getType() + '>');
    jt.advance();
}
out.push('</tokens>');

fs.writeFileSync(outfile, out.join('\n'), 'utf8');
