import path from 'path';
import { Command } from 'commander';
import { serve } from '@jsxnotes/local-api';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    //cwd = current working directory (absolute path)
    //dirname = directory name (e.g. notes/notebook.js returns notes)
    //basename = filename (e.g. notes/notebook.js returns notebook.js)

    try {
      const dir = path.join(process.cwd(), path.dirname(filename));

      console.log(`DIR: ${dir}`);
      await serve(parseInt(options.port), filename, dir, !isProduction);

      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err: any) {
      if (err.code === 'EDDRINUSE')
        console.error(`Port is in use. Try running on a different port.`);
      else console.log(`Here is the problem: ${err.message}`);
      process.exit(1);
    }
  });
