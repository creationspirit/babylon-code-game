import { Action } from 'redux';
import * as constants from '../constants';

export interface IItemsSuccess extends Action {
  type: constants.ITEMS_SUCCESS;
  items: [];
}

export interface IItemsError extends Action {
  type: constants.ITEMS_ERROR;
  error: string;
}

export interface IItemsLoading extends Action {
  type: constants.ITEMS_LOADING;
}

export function itemsSuccess(items: []): IItemsSuccess {
  return {
    type: constants.ITEMS_SUCCESS,
    items,
  };
}

export function itemsError(error: string): IItemsError {
  return {
    type: constants.ITEMS_ERROR,
    error,
  };
}

export function itemsLoading(): IItemsLoading {
  return {
    type: constants.ITEMS_LOADING,
  };
}
