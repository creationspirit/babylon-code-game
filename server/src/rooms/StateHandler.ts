import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from './state/PlayerState';
import { QuestionState } from './state/QuestionState';
import { msToMinSec } from '../utils/gameUtils';
import { GameStatus } from './constants';
import { DudeState } from './state/DudeState';

export class StateHandler extends Schema {
  @type('string')
  timer: string;

  @type('string')
  status: string;

  @type(DudeState)
  dude: DudeState;

  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  @type({ map: QuestionState })
  questions = new MapSchema<QuestionState>();

  constructor(time: number) {
    super();
    this.timer = msToMinSec(time);
    this.status = GameStatus.ONGOING;
    this.dude = new DudeState();
  }

  addPlayer(clientId: string, player: PlayerState): void {
    console.log('added player for ', clientId);
    this.players[clientId] = player;
  }

  getPlayer(clientId: string): PlayerState {
    return this.players[clientId];
  }

  removePlayer(clientId: string): void {
    delete this.players[clientId];
  }

  addQuestion(data: any, x: number, y: number): void {
    const newQuestion = new QuestionState(data, x, y);
    this.questions[data.id] = newQuestion;
  }

  removeQuestion(questionId: number): void {
    delete this.questions[questionId];
  }

  updateTimer(time: number) {
    this.timer = msToMinSec(time);
    if (time === 0) {
      this.status = GameStatus.LOSE;
    }
  }
}
