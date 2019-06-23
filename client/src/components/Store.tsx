import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Transition, Message } from 'semantic-ui-react';

import { IRootState } from '../types';
import Navbar from './fragments/Navbar';
import { fetchItems, buyItem } from '../thunks/items';
import { GAME_API_BASE_URL } from '../config';

export interface IStoreProps {
  fetchItems: () => void;
  buyItem: (itemId: number, amount: number) => void;
  items: any[];
  user: any;
}

class Store extends Component<IStoreProps> {
  state = { messageVisible: false };

  componentDidMount() {
    this.props.fetchItems();
  }

  buyItem = (item: any) => {
    if (this.props.user.stats.loc < item.price) {
      this.setState({ messageVisible: true });
      return setTimeout(() => this.setState({ messageVisible: false }), 6000);
    }

    this.props.buyItem(item.id, 1);
  };

  renderItems = () => {
    if (this.props.items.length === 0) {
      return <p>No available items at the moment.</p>;
    }
    return this.props.items.map((item: any) => {
      const userItem = this.props.user.items.find((i: any) => i.item && i.item.id === item.id);
      const amount = userItem ? userItem.amount : 0;

      return (
        <div className="item" key={item.id}>
          <div className="tiny image">
            <img src={`${GAME_API_BASE_URL}${item.imageUrl}`} />
          </div>
          <div className="content">
            <a className="header">{item.name}</a>
            <div className="meta">
              <span className="cinema">Price: {item.price} LOC</span>
            </div>
            <div className="description">
              <p>{item.description}</p>
            </div>
            <div className="extra">
              <div className="ui right floated orange button" onClick={() => this.buyItem(item)}>
                Buy x1
              </div>
              <div className="ui label">You have: {amount}</div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="ui container">
        <Navbar />
        <h3 className="ui header store-header">
          <i className="shopping cart icon" />
          <div className="content">
            Store
            <div className="sub header">You can buy consumable items here with LOC</div>
          </div>
        </h3>
        <Transition visible={this.state.messageVisible} animation="scale" duration={300}>
          <Message
            warning={true}
            header="You don't have enough lines of code."
            content="You can go play co-op or arena matches to earn them."
          />
        </Transition>
        <div className="ui divided items">{this.renderItems()}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ items, auth }: IRootState) => {
  return {
    items: items.items,
    user: auth.user,
  };
};

export default connect(
  mapStateToProps,
  { fetchItems, buyItem }
)(Store);
