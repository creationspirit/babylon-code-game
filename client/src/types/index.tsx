import * as Colyseus from 'colyseus.js';

export interface IClientState {
  client: Colyseus.Client | null;
}

export interface IAuthState {
  isAuthenticating: boolean;
  user: {} | null;
  error: string | null;
}

export interface IStageState {
  loading: boolean;
  stages: [];
  error: string | null;
}

export interface IAchievementState {
  loading: boolean;
  achievements: [];
  error: string | null;
}

export interface IUserState {
  loading: boolean;
  users: [];
  error: string | null;
}

export interface IRootState {
  gameClient: IClientState;
  auth: IAuthState;
  stages: IStageState;
  achievements: IAchievementState;
  users: IUserState;
}
