import './add-cell.css';
import { useActions } from '../hooks/use-actions';
import { FaPlusCircle } from 'react-icons/fa';

interface AddCellProps {
  previousCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, forceVisible }) => {
  const { insertCellAfter } = useActions();
  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => {
            insertCellAfter(previousCellId, 'code');
          }}
        >
          <span className="icon is-small">
            <FaPlusCircle />
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => {
            insertCellAfter(previousCellId, 'text');
          }}
        >
          <span className="icon is-small">
            <FaPlusCircle />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
