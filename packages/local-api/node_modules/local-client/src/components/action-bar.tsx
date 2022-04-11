import './action-bar.css';

import { useActions } from '../hooks/use-actions';
import { FaArrowUp, FaArrowDown, FaWindowClose } from 'react-icons/fa';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <button
        className="button is-primary is-small"
        onClick={() => moveCell(id, 'up')}
      >
        <span className="icon">
          <FaArrowUp />
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => moveCell(id, 'down')}
      >
        <span className="icon">
          <FaArrowDown />
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => deleteCell(id)}
      >
        <span className="icon">
          <FaWindowClose />
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
