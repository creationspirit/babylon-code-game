import * as Colyseus from 'colyseus.js';
import * as BABYLON from 'babylonjs';

import { Game } from '../Game';
import { GameStatus } from '../../constants';
import { createVector } from '../utils';

export const PLAYER_MOVEMENT: string = 'move';
export const SOLUTION_UPDATE: string = 'supd';
export const SOLVE_ATTEMPT: string = 'solv';
export const COLLECT: string = 'coll';
export const DISPLAY_REWARD: string = 'drew';
export const USE_FUTURE_GADGET: string = 'ufg';
export const QUICK_QUESTION: string = 'qq';
export const QUICK_QUESTION_ANSWER: string = 'qqa';

export class RouterService {
  client: Colyseus.Client;
  room!: Colyseus.Room;
  roomId: string;
  mode: string;
  options: any;
  team?: string;

  constructor(client: Colyseus.Client, roomId: string, roomData: any) {
    this.client = client;
    this.mode = roomData.mode;
    this.roomId = roomId === 'new' ? roomData.mode : roomId;
    this.options = { token: localStorage.getItem('token') };
    if (roomId === 'new') {
      this.options.create = true;
      this.options.roomData = roomData;
    }
  }

  connect(game: Game) {
    this.room = this.client.join(this.roomId, this.options);
    this.room.onJoin.add(() => {
      console.log('client joined successfully');

      this.room.onMessage.add((message: any) => {
        if (message.type === 'LVL_INIT') {
          console.log(message);
          game.initGameStateAndRun(message.data);
          this.setupMessageListeners(game);
        }
      });
    });
  }

  setupMessageListeners(game: Game) {
    if (this.mode === 'battle') {
      this.setupBattleMessageListeners(game);
    } else {
      this.setupCoopMessageListeners(game);
    }
  }

  private setupCoopMessageListeners(game: Game) {
    // recieve game state for the first time
    this.room.onStateChange.addOnce((state: any) => {
      Object.keys(state.players).forEach((key: string) => {
        if (key !== this.room.sessionId) {
          game.addPlayer(key, new BABYLON.Vector3(state.players[key].x, 0.2, state.players[key].y));
        }
      });
      Object.keys(state.questions).forEach((key: string) => {
        game.addPickup(
          key,
          new BABYLON.Vector3(state.questions[key].x, 0.2, state.questions[key].y)
        );
      });
      game.timer.text = state.timer;
      game.dude.update(new BABYLON.Vector3(state.dude.x, 0.2, state.dude.y));
    });

    this.room.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        if (change.field === 'timer') {
          game.timer.text = change.value;
        }

        if (change.field === 'status') {
          if (change.value === GameStatus.WIN) {
            game.setGameResult(GameStatus.WIN);
          } else if (change.value === GameStatus.LOSE) {
            game.setGameResult(GameStatus.LOSE);
          }
        }

        if (change.field === 'dude') {
          game.dude.update(new BABYLON.Vector3(change.value.x, 0.2, change.value.y));
        }
      });
    };

    this.room.state.questions.onAdd = (question: any, key: string) => {
      game.addPickup(key, new BABYLON.Vector3(question.x, 0.2, question.y));
    };

    this.room.state.questions.onRemove = (question: any, key: string) => {
      game.removePickup(key);
      game.resetState(question.id);
    };

    this.room.state.players.onAdd = (player: any, key: string) => {
      if (key !== this.room.sessionId) {
        console.log(player, 'has been added at', key);
        game.addPlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
      }
    };

    this.room.state.players.onChange = (player: any, key: string) => {
      game.updatePlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
      if (key === this.room.sessionId) {
        game.player.disableOrEnableMovement(player.caught);
      }
    };

    this.room.state.players.onRemove = (player: any, key: string) => {
      game.removePlayer(key);
    };

    this.room.state.questions.onChange = (question: any, key: string) => {
      if (game.player.inSolvingAreaOf && parseInt(game.player.inSolvingAreaOf.id) === question.id) {
        game.setQuestion(question);
      }
    };

    this.room.onMessage.add((message: any) => {
      if (message.type === DISPLAY_REWARD) {
        const { id, loc, exp } = message.data;
        const notificationText = `Question ${id} solved!\nREWARDS:\nLOC ${loc}\nXP ${exp}`;
        game.createNotificationGUI(notificationText, 6000);
      }

      if (message.type === QUICK_QUESTION) {
        game.setQuickQuestion(message.data);
      }
    });

    this.room.onLeave.add(() => {
      game.returnHome();
    });
  }

  private setupBattleMessageListeners(game: Game) {
    // recieve game state for the first time
    this.room.onStateChange.addOnce((state: any) => {
      Object.keys(state.players).forEach((key: string) => {
        if (key !== this.room.sessionId) {
          game.addPlayer(key, new BABYLON.Vector3(state.players[key].x, 0.2, state.players[key].y));
        } else {
          this.team = state.players[key].team;
        }
      });
      Object.keys(state.questions).forEach((key: string) => {
        game.addPickup(
          key,
          new BABYLON.Vector3(state.questions[key].x, 0.2, state.questions[key].y)
        );
      });
      game.scoreboard.text = `${state.blueScore} - ${state.redScore}`;
    });

    this.room.state.onChange = (changes: any) => {
      changes.forEach((change: any) => {
        if (change.field === 'blueScore' || change.field === 'redScore') {
          game.scoreboard.text = `${this.room.state.blueScore} - ${this.room.state.redScore}`;
        }

        // if (change.field === 'status') {
        //   if (change.value === GameStatus.OVER) {
        //     const team = this.room.state.players[this.room.sessionId].team
        //     this.room.state.
        //     if (team === 'red' &&  this.room.state.reacore)

        //     game.setGameResult(GameStatus.WIN);
        //   } else if (change.value === GameStatus.LOSE) {
        //     game.setGameResult(GameStatus.LOSE);
        //   }
        // }
      });
    };

    this.room.state.questions.onAdd = (question: any, key: string) => {
      game.addPickup(key, new BABYLON.Vector3(question.x, 0.2, question.y));
    };

    this.room.state.questions.onRemove = (question: any, key: string) => {
      game.removePickup(key);
      game.resetState(question.id);
    };

    this.room.state.players.onAdd = (player: any, key: string) => {
      if (key !== this.room.sessionId) {
        console.log(player, 'has been added at', key);
        game.addPlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
      } else {
        this.team = player.team;
      }
    };

    this.room.state.players.onChange = (player: any, key: string) => {
      game.updatePlayer(key, new BABYLON.Vector3(player.x, 0.2, player.y));
    };

    this.room.state.players.onRemove = (player: any, key: string) => {
      game.removePlayer(key);
    };

    this.room.state.questions.onChange = (question: any, key: string) => {
      if (game.player.inSolvingAreaOf && parseInt(game.player.inSolvingAreaOf.id) === question.id) {
        const questionData: any = {};
        questionData.solution = question.solutions[this.team as string].solution;
        questionData.tests = question.solutions[this.team as string].tests;
        questionData.status = question.solutions[this.team as string].status;
        questionData.id = question.id;
        questionData.text = question.text;
        game.setQuestion(questionData);
      }
    };

    this.room.onMessage.add((message: any) => {
      if (message.type === DISPLAY_REWARD) {
        console.log(message);
        const { id, loc, exp } = message.data;
        const notificationText = `Question ${id} solved!\nREWARDS:\nLOC ${loc}\nXP ${exp}`;
        game.createNotificationGUI(notificationText, 6000);
      }
    });
  }

  sendMovement(
    direction: BABYLON.Vector2,
    keyUp: boolean,
    keyDown: boolean,
    keyLeft: boolean,
    keyRight: boolean
  ) {
    this.room.send({
      type: PLAYER_MOVEMENT,
      data: { direction, keyUp, keyDown, keyLeft, keyRight },
    });
  }

  sendSolutionUpdate(id: string, sourceCode: string) {
    this.room.send({
      type: SOLUTION_UPDATE,
      data: { id, sourceCode },
    });
  }

  sendSolveAttempt(id: string) {
    this.room.send({
      type: SOLVE_ATTEMPT,
      data: { id },
    });
  }

  sendCollectReward(id: string) {
    this.room.send({
      type: COLLECT,
      data: { id },
    });
  }

  sendUseFutureGadget() {
    this.room.send({
      type: USE_FUTURE_GADGET,
    });
  }

  sendQuickQuestionAnswer(questionId: number, answerId: number) {
    this.room.send({
      type: QUICK_QUESTION_ANSWER,
      data: {
        questionId,
        answerId,
      },
    });
  }
}
