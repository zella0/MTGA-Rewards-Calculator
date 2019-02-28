// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import { parseLog } from '../utils/logParser';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes';

const fs = require('fs');

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount(){
    const mtgLogFile = fs.readFileSync('/Users/xella/Desktop/log.txt', 'utf-8');

    let asdf = parseLog(mtgLogFile, 'PlayerInventory.GetPlayerCardsV3');

    console.log(asdf);
  }

  render() {
    return (
      <div className={styles.container}>
        <h2>Hello World</h2>
      </div>
    );
  }
}





