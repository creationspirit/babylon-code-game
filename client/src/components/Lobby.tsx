import React, { Component } from 'react';
import { Client } from 'colyseus.js';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { IRootState } from '../types';

export interface ILobbyProps {
  client: Client | null;
}

class Lobby extends Component<ILobbyProps> {
  state = { availableRooms: [], selectedRoom: undefined };

  private checkRoomsInterval!: NodeJS.Timeout;

  componentDidMount() {
    this.checkRoomsInterval = setInterval(this.getAvailableRooms, 4000);
    this.getAvailableRooms();
  }

  getAvailableRooms = () => {
    (this.props.client as Client).getAvailableRooms('game', (rooms, err) => {
      if (err) {
        return console.error(err);
      }
      this.setState({ availableRooms: rooms });
    });
  };

  componentWillUnmount() {
    clearInterval(this.checkRoomsInterval);
  }

  selectRoom = (roomId: string) => {
    this.setState({ selectedRoom: roomId });
  };

  renderAvailableRooms() {
    if (this.state.availableRooms.length === 0) {
      return <div className="item">No rooms available</div>;
    }
    return this.state.availableRooms.map((room: any) => {
      const selected = room.roomId === this.state.selectedRoom;
      return (
        <div
          className={`item${selected ? ' selected' : ''}`}
          key={room.roomId}
          onClick={() => this.selectRoom(room.roomId)}
        >
          {selected && (
            <div className="right floated content">
              <Link to={`/game/${room.roomId}`}>
                <div className="ui primary button">Join</div>
              </Link>
            </div>
          )}
          <div className="content">
            <div className="header">{room.roomId}</div>
            <div className="description">
              {room.clients}/{room.maxClients}
            </div>
          </div>
        </div>
      );
    });
  }

  create = () => {
    if (this.props.client) {
      this.props.client.join('game', { create: true });
    }
  };

  render() {
    return (
      <div className="ui container">
        <div className="ui raised segment">
          <h3 className="ui header">
            <i className="circular inverted users icon" />
            <div className="content">
              Available rooms
              <div className="sub header">Choose one to join</div>
            </div>
          </h3>
          <div className="ui divided list">{this.renderAvailableRooms()}</div>
        </div>
        <div className="ui raised segment">
          <Link to={`/game/new`}>
            <div className="ui primary button">Create new room</div>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gameClient }: IRootState) => {
  return {
    client: gameClient.client,
  };
};

export default connect(
  mapStateToProps,
  null
)(Lobby);
