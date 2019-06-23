import * as Colyseus from 'colyseus.js';
import { addGameClient } from '../actions';
import { ThunkAction } from 'redux-thunk';
import { IRootState } from '../types';
import { IActions } from '../actions';
import { GAME_SERVER_CLIENT_URI } from '../config';

export type ThunkResult<R> = ThunkAction<R, IRootState, undefined, IActions>;

export const connectToGameClient = (): ThunkResult<void> => {
  return async dispatch => {
    const client = new Colyseus.Client(GAME_SERVER_CLIENT_URI);
    await dispatch(addGameClient(client));
  };
};
