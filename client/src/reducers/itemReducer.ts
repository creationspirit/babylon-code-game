import { IActions } from '../actions';
import { IItemState } from '../types/index';
import { ITEMS_LOADING, ITEMS_SUCCESS, ITEMS_ERROR } from '../constants/index';
import { Reducer } from 'redux';

const initialState: IItemState = {
  loading: false,
  items: [],
  error: null,
};

export const items: Reducer<IItemState, IActions> = (state = initialState, action) => {
  switch (action.type) {
    case ITEMS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ITEMS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ITEMS_SUCCESS:
      return {
        loading: false,
        items: action.items,
        error: null,
      };
  }
  return state;
};
