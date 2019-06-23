import { combineReducers } from 'redux';
import { gameClient } from './gameClientReducer';
import { auth } from './authReducer';
import { stages } from './stageReducer';
import { achievements } from './achievementReducer';
import { users } from './userReducer';
import { items } from './itemReducer';

export default combineReducers({
  gameClient,
  auth,
  stages,
  achievements,
  users,
  items,
});
