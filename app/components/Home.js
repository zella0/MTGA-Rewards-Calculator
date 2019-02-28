// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import { MTGASet, parseLog, defaultLogUri, calculateSetTotals } from '../utils/logParser';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes';

const fs = require('fs');
const path = require('path');


type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount(){
    
    const mtgLogFile = fs.readFileSync(defaultLogUri(), 'utf-8');
    const PLAYER_CARDS_SPECIFIER = 'PlayerInventory.GetPlayerCardsV3';
    const userCards = parseLog(mtgLogFile, PLAYER_CARDS_SPECIFIER);
    const ARENA_CARDS_PATH = `${path.resolve(__dirname)}\\data\\arena-cards.json`;
    const dbCards = JSON.parse(fs.readFileSync(ARENA_CARDS_PATH, 'utf-8'));
    
    let sets = calculateSetTotals(userCards, dbCards);
    console.log(sets);
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Hello World</h2>
      </div>
    );
  }
}





