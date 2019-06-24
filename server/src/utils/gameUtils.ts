import * as BABYLON from 'babylonjs';

export const createVector = (config: { x: number; y: number; z: number }): BABYLON.Vector3 => {
  return new BABYLON.Vector3(config.x, config.y, config.z);
};

export const msToMinSec = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getRandomArrayElements = (arr: any[], n: number): any[] => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  let x;
  while (n--) {
    x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export const EXP_CONSTANT = 38;

export const calculateExpLvlThreshold = (level: number) => {
  return EXP_CONSTANT * Math.pow(level, 2);
};

export const calculateCurrentLevelExp = (exp: number, level: number) => {
  return exp - calculateExpLvlThreshold(level);
};

export const calculateCurrentLevelGap = (level: number) => {
  return calculateExpLvlThreshold(level + 1) - calculateExpLvlThreshold(level);
};

/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */
export const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Get a random boolean value.
 *
 * @return {boolean} a random true/false
 */
function getRandomBool() {
  return Math.random() >= 0.5;
}
