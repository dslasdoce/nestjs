import fs from 'fs';
import path from 'path';
import config from 'config';
import { createTypedefCode } from './createTypedefCode';

const file = `Config.d.ts`;
createTypedefCode(config).then((ts) => {
  fs.writeFileSync(path.resolve(process.cwd(), 'config', file), ts);
});
