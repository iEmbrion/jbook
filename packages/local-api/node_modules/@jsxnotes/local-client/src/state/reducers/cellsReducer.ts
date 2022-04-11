import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  //cell id: {Cell attributes}
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState | void => {
    if (action.type === ActionType.FETCH_CELLS) {
      state.loading = true;
      state.error = null;
    } else if (action.type === ActionType.FETCH_CELLS_COMPLETE) {
      state.order = action.payload.map(cell => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
    } else if (action.type === ActionType.FETCH_CELLS_ERROR) {
      state.loading = false;
      state.error = action.payload;
    } else if (action.type === ActionType.SAVE_CELLS_ERROR) {
      state.loading = false;
      state.error = action.payload;
    } else if (action.type === ActionType.MOVE_CELL) {
      const { direction } = action.payload;
      const index = state.order.findIndex(id => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) return state;
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
    } else if (action.type === ActionType.INSERT_CELL_AFTER) {
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell;
      const index = state.order.findIndex(id => id === action.payload.id);

      if (index < 0) state.order.unshift(cell.id);
      else state.order.splice(index + 1, 0, cell.id);
    } else if (action.type === ActionType.UPDATE_CELL) {
      const { id, content } = action.payload;
      state.data[id].content = content;
    } else if (action.type === ActionType.DELETE_CELL) {
      delete state.data[action.payload];
      state.order = state.order.filter(id => id !== action.payload);
    }

    return state;
  },
  initialState
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;
