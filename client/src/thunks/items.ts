import { itemsError, itemsSuccess, itemsLoading } from '../actions/items';
import { Dispatch } from 'redux';
import { ThunkResult } from './index';
import { gameAPI } from '../config/request';
import { fetchUserData } from './auth';

export const fetchItems = (): ThunkResult<void> => {
  return async dispatch => {
    dispatch(itemsLoading());
    const token = localStorage.token;
    try {
      const response = await gameAPI.get('/items', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(itemsSuccess(response.data.items));
    } catch (e) {
      if (e.response.status === 400) {
        dispatch(itemsError(e.response.data.message));
      } else {
        dispatch(itemsError('Items fetch failed'));
      }
    }
  };
};

export const buyItem = (itemId: number, amount: number): ThunkResult<void> => {
  return async dispatch => {
    const token = localStorage.token;
    try {
      const response = await gameAPI.post(
        '/items/buy',
        { itemId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await dispatch(fetchUserData());
    } catch (e) {
      console.log('Item buy failed', e.message);
    }
  };
};
