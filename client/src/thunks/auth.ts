import { loginError, loginSuccess, loginRequest, logoutUser } from '../actions/auth';
import { ThunkResult } from './index';
import { gameAPI } from '../config/request';

export const login = (edgarToken: string): ThunkResult<void> => {
  return async dispatch => {
    dispatch(loginRequest());
    try {
      const response = await gameAPI.post('/users/login', { edgarToken });
      localStorage.setItem('token', response.data.token);
      dispatch(loginSuccess(response.data.user));
    } catch (e) {
      if (e.response && e.response.status === 400) {
        dispatch(loginError(e.response.data.message));
      } else {
        dispatch(loginError('Login failed'));
      }
    }
  };
};

export const logout = (): ThunkResult<void> => {
  return async dispatch => {
    localStorage.removeItem('token');
    dispatch(logoutUser());
  };
};

export const fetchUserData = (): ThunkResult<void> => {
  return async dispatch => {
    const token = localStorage.token;
    if (token) {
      try {
        const response = await gameAPI.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(loginSuccess(response.data));
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  };
};
