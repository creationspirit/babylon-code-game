import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Progress } from 'semantic-ui-react';

import { IRootState } from '../../types';
import { GAME_API_BASE_URL } from '../../config';

interface IQuickQuestionProps {
  question: any;
  onAnswer: (answerId: number) => void;
  user: any;
}

class QuickQuestion extends Component<IQuickQuestionProps> {
  state = { time: 100 };
  countdown!: NodeJS.Timeout;

  componentDidMount() {
    this.countdown = setInterval(() => {
      const newTime = this.state.time - 1;
      if (newTime === 0) {
        this.chooseAnswer(-2);
      }
      this.setState({ time: newTime });
    }, 300);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  chooseAnswer = (answerId: number) => {
    clearInterval(this.countdown);
    this.props.onAnswer(answerId);
  };

  renderIcecreamButton = () => {
    const item = this.props.user.items.find((i: any) => i.item.id === 2);
    if (item && item.amount > 0) {
      return (
        <button className="ui basic button" onClick={() => this.chooseAnswer(-1)}>
          <img className="ui avatar image" src={`${GAME_API_BASE_URL}${item.item.imageUrl}`} />
          Give him an ice cream
        </button>
      );
    }
    return '';
  };

  renderAnswers = () => {
    const answers = this.props.question.answers.map((answer: any) => {
      return (
        <div className="ui segment" key={answer.id} onClick={() => this.chooseAnswer(answer.id)}>
          <p>{answer.answer_text}</p>
        </div>
      );
    });
    return <div className="ui segments">{answers}</div>;
  };

  render() {
    const { question } = this.props;

    return (
      <div className="quick-question">
        <div className="ui center aligned segment">
          <h3 className="ui header">The Dude has caught you. Answer his question quickly!</h3>
          <Progress percent={this.state.time} indicating={true} />
          <h4 className="ui header">{question.question_text}</h4>
          {this.renderAnswers()}
          {this.renderIcecreamButton()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }: IRootState) => {
  return {
    user: auth.user,
  };
};

export default connect(
  mapStateToProps,
  {}
)(QuickQuestion);
