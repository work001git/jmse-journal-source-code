const fs = require('fs');
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => buf += chunk);
process.stdin.on('end', () => {
  const target = process.argv[2];
  const mode = process.argv[3];
  if (!target) {
    console.error('No target file');
    process.exit(1);
  }
  if (mode === 'append') {
    fs.appendFileSync(target, buf, 'utf8');
    console.log(`[write.cjs] Appended to ${target} (${buf.length} bytes)`);
  } else {
    fs.writeFileSync(target, buf, 'utf8');
    console.log(`[write.cjs] Wrote to ${target} (${buf.length} bytes)`);
  }
});
