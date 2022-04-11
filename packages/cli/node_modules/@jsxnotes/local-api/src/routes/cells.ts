import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cells {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  // console.log(fullPath);
  router.get('/cells', async (req, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      if (!result || result.trim().length === 0) {
        res.send([]);
      }
      res.send(JSON.parse(result));
    } catch (err: any) {
      //if file does not exists
      if (err.code === 'ENOENT') {
        //Add code to create a file and default cells
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    //Take list of cells from request object
    //serialize them (turn them into format that can be saved into file)
    const { cells }: { cells: Cells[] } = req.body;

    //Write the cells into file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
