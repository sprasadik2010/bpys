const fs = require('fs');
if (!fs.existsSync('./server/node_modules'))
  throw new Error(
    'Error: node_modules directory missing'
  );