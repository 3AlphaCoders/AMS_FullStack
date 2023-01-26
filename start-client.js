const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'public', shell: true };
require('child_process').spawn('npm', args, opts);