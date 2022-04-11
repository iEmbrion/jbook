import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();

  const bundle = useTypedSelector(state => state.bundles[cell.id]);
  const isBundle = !!bundle;

  const cumulativeCode = useTypedSelector(state => {
    const { data, order } = state.cells;
    const orderedCells = order.map(id => data[id]);

    const cumlativeCode = [
      `
        import _React from 'react';
        import _ReactDOM from 'react-dom';

        const show = (value) => {
          let root = document.querySelector('#root');

          if(typeof value === 'object'){
            //If its JSX element
            if(value.$$typeof && value.props){
              console.log(value);
              _ReactDOM.render(value, root); 
            }

            root.innerHTML = JSON.stringify(value);
          }else{
            root.innerHTML = value;
          }     
        }
      `,
    ];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        cumlativeCode.push(c.content);
      }

      if (c.id === cell.id) {
        break;
      }
    }
    return cumlativeCode;
  });

  useEffect(() => {
    if (!isBundle) {
      createBundle(cell.id, cumulativeCode.join('\n'));
      return;
    }

    const timer = setTimeout(async () => {
      // const output = await bundleCode(cell.content);
      createBundle(cell.id, cumulativeCode.join('\n'));
    }, 750);

    //This triggers every time useEffect is triggered again
    return () => {
      clearTimeout(timer);
    };
  }, [cell.id, cumulativeCode.join('\n'), createBundle, isBundle]);

  //   const initialCode = `import React from 'react';
  // import ReactDOM from 'react-dom';

  // const App = () => {
  //   return <h1>Hello!</h1>;
  // };

  // ReactDOM.render(<App />, document.querySelector('#root'));`;

  return (
    <div className="app">
      <Resizable direction="vertical">
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Resizable direction="horizontal">
            <CodeEditor
              initialValue={cell.content}
              onChange={value => updateCell(cell.id, value)}
            />
          </Resizable>
          <div className="progress-wrapper">
            {!bundle || bundle.loading ? (
              <div className="progress-cover">
                <progress className="progress is-small is-primary" max="100">
                  Loading
                </progress>
              </div>
            ) : (
              <Preview code={bundle.code} err={bundle.err} />
            )}
          </div>
        </div>
      </Resizable>
    </div>
  );
};

export default CodeCell;
