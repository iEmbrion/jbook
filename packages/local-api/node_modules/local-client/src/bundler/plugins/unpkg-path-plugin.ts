import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      //if "./" or "../"
      //Handle relative paths in a module (e.g. import utils from './helper')
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        // console.log('onResolve', args);
        return {
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
          namespace: 'a',
        };
      });

      //Handle main file of a module (e.g. import axios from 'axios')
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log(`onResolve: Handle main file: ${args.path}`);
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
