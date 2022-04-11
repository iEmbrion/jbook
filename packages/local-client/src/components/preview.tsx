import './preview.css';
import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector("#root");
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              throw err;
          }

          window.addEventListener('error', () => {
            event.preventDefault();
            handleError(event.error);
          })

          window.addEventListener('message', (event) => {
            try{
              eval(event.data);
            }catch(err){
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    //contentWindow returns a window object of the iFrame element

    //postMessage safely enables cross-origin communication between Window objects e.g. a page and a pop-up
    //Here, it is posting message from parent to the iframe
    //Inside the iframe, there will be an event listener (coded by us) listetning and handling this event

    //The timeout is to ensure the line above finishes its code execution before executing this line
    setTimeout(() => iframe.current.contentWindow.postMessage(code, '*'), 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        style={{ backgroundColor: 'white' }}
        height="100%"
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={code !== '' ? html : err}
      />
    </div>
  );
};

export default Preview;
