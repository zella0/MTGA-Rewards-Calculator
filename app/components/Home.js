// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import { parseLog, defaultLogUri, calcPayouts } from '../utils/logParser';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes';

const fs = require('fs');
const path = require('path');

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount(){
    
    const mtgLogFile = fs.readFileSync(defaultLogUri(), 'utf-8');

    const userCards = parseLog(mtgLogFile, 'PlayerInventory.GetPlayerCardsV3');
    const dbCards = JSON.parse(fs.readFileSync(`${path.resolve(__dirname)}\\data\\arena-cards.json`, 'utf-8'));
    
    calcPayouts(userCards, dbCards);
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Hello World</h2>
      </div>
    );
  }
}





