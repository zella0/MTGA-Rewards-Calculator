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


type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount(){
    checkAndDownloadCards(() => {
      fs.access(defaultLogUri(), fs.constants.R_OK, (err) => {
        console.log(`${defaultLogUri()} ${err ? 'is not readable' : 'is readable'}`);
      });
      const mtgLogFile = fs.readFileSync(defaultLogUri(), 'utf-8');
      const PLAYER_CARDS_SPECIFIER = 'PlayerInventory.GetPlayerCardsV3';
      const userCards = parseLog(mtgLogFile.toString(), PLAYER_CARDS_SPECIFIER);
      const dbCards = JSON.parse(fs.readFileSync(ARENA_CARDS_PATH, 'utf-8'));
      console.log(userCards);
      console.log(dbCards);
      const sets = calculateSetTotals(userCards, dbCards);
      console.log(sets);
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Hello World</h2>
      </div>
    );
  }
}





