import config from 'config';
import fs from 'fs';
import path from 'path';
import mustache from 'mustache';

export enum TemplateEnum {
  VERIFICATIONLINK = 'verificationLink.hbs',
}

const API_URL = config.server.url;

const get = (template: TemplateEnum, params: any) => {
  const file = fs.readFileSync(path.resolve(__dirname, 'templates', template), 'utf8');
  return mustache.render(file, { mainUrl: API_URL, ...params });
};

export default { get };
