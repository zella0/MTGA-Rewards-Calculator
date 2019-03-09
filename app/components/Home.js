// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import { MTGASet, parseLog, defaultLogUri, calculateSetTotals } from '../utils/logParser';
import {checkAndDownloadCards, ARENA_CARDS_PATH} from '../data/cardMaker';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes';

const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const app = remote.app;



export default class Home extends Component {
  state = {
    userCards: undefined,
    dbCards: undefined,
    sets: undefined
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    checkAndDownloadCards(() => {
      fs.access(defaultLogUri(), fs.constants.R_OK, (err) => {
        console.log(`${defaultLogUri()} ${err ? 'is not readable' : 'is readable'}`);
      });
      const mtgLogFile = fs.readFileSync(defaultLogUri(), 'utf-8');
      const PLAYER_CARDS_SPECIFIER = 'PlayerInventory.GetPlayerCardsV3';
      const userCardsConst = parseLog(mtgLogFile.toString(), PLAYER_CARDS_SPECIFIER);
      const dbCardsConst = JSON.parse(fs.readFileSync(ARENA_CARDS_PATH, 'utf-8'));
      const setsConst = calculateSetTotals(userCardsConst, dbCardsConst);
      this.setState({
        userCards: userCardsConst,
        dbCards: dbCardsConst,
        sets: setsConst
      });
      console.log(this.state);
      this.forceUpdate();
    });
  }

  showLists(sets) {
    return (
    <div className={styles.formbox}>
    <ul id="sets">
    
    {Object.keys(sets).map( name => {
      let set = sets[name];
      console.log(set);
      return set.toHTML();
    })}
    </ul>
    </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Set Summary</h2>
        {this.state.sets ? this.showLists(this.state.sets) : ''}
      </div>
    );
  }
}





