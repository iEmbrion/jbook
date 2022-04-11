import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    //For Dev
    // websocket used by create-react-app to monitor changes for real-time hot-reload
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    //Handle symbolic link to resolve it into absolute path using Node's resolution algorithm to find the specified file
    //When used in dev, it will still resolve to our local-client directory
    //When used by other users, it will resolve to its dependency path (node_modules)
    const packagePath = require.resolve(
      '@jsxnotes/local-client/build/index.html'
    );
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });

  // app.listen(port, () => {
  //   console.log('Listening on port', port);
  // });
};
