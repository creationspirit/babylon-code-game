import { stagesError, stagesSuccess, stagesLoading } from '../actions/stages';
import { ThunkResult } from './index';
import { gameAPI } from '../config/request';

export const fetchStages = (): ThunkResult<void> => {
  return async dispatch => {
    dispatch(stagesLoading());
    const token = localStorage.token;
    try {
      const response = await gameAPI.get('/stages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(stagesSuccess(response.data.stages));
    } catch (e) {
      if (e.response.status === 400) {
        dispatch(stagesError(e.response.data.message));
      } else {
        dispatch(stagesError('Stages fetch failed'));
      }
    }
  };
};
