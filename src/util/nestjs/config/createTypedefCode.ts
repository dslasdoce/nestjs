import prettier from 'prettier';
import JsonToTS from 'json-to-ts';

export const createTypedefCode = (config: Record<string, any>) => {
  const rootName = 'IConfig';
  const ts = prettier.format(
    ['/* tslint:disable */', '/* eslint-disable */', 'declare module "config" { namespace config {']
      .concat(JsonToTS(config, { rootName }))
      .concat(['}', `const config: config.${rootName}`, 'export = config', `export type Config = ${rootName}`, '}'])
      .join('\n'),
    {
      parser: 'typescript',
      semi: false,
    },
  );

  return ts;
};
