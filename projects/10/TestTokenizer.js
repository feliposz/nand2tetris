const fs = require('fs');
const path = require('path');
const JackTokenizer = require('./JackTokenizer.js');

const infile = process.argv[2];
const outfile = path.join(path.dirname(infile), path.basename(infile, path.extname(infile)) + 'T.test.xml');
const data = fs.readFileSync(infile, 'utf8');
const jt = new JackTokenizer(data);

const out = [];
out.push('<tokens>');
jt.advance();
while (jt.hasMoreTokens()) {
    let value = jt.getValue();
    if (jt.getType() == 'symbol') {
        if (value == '&') {
            value = '&amp;';
        } else if (value == '<') {
            value = '&lt;';
        } else if (value == '>') {
            value = '&gt;';
        }
    }
    out.push('<' + jt.getType() + '> '+ value + ' </' + jt.getType() + '>');
    jt.advance();
}
out.push('</tokens>');

fs.writeFileSync(outfile, out.join('\n'), 'utf8');
