import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();

  //Returns an object where its key is the actionCreator method name and its value is something like a dispatch call with the action creator (E.g. below)

  //{searchRepositories: dispatch(searchRepositories)}
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
