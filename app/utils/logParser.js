import React from 'react';
/**
 * Class that holds data about a MTGA set of cards.
 */
export class MTGASet {
  constructor(name) {
    this.name = name
    this.user = {
      common: 0,
      uncommon: 0,
      rare: 0,
      mythic: 0
    }
    this.total = {
      common: 0,
      uncommon: 0,
      rare: 0,
      mythic: 0
    }
  }

  addRarity(rarity, amount) {
    this.user[rarity] += amount;
    this.total[rarity] += 4;
  }

  getTotalCompletion() {
    let userTotal = 0;
    let totalTotal = 0;
    Object.keys(this.user).map(key => {
      userTotal += this.user[key];
      totalTotal += this.total[key];
    });
    //Return percent complete
    return (userTotal/totalTotal*100).toFixed(2)
  }

  toHTML() {
    return (
    <li key={this.name}>
      <h3>{this.name} - {this.getTotalCompletion()}%</h3>
      <ol>
      {this.outputRarity('common')}
      {this.outputRarity('uncommon')}
      {this.outputRarity('rare')}
      {this.outputRarity('mythic')}
      </ol>
    </li>
    )
  }

  outputRarity(rarity) {
    return (
      (this.total[rarity] != 0) ? (
        <li>{rarity[0].toUpperCase()+rarity.slice(1)}: {this.user[rarity]}/{this.total[rarity]} - {(this.user[rarity]/this.total[rarity]*100).toFixed(2)}%</li>
      ) : (
        ''
      )
    )
  }
}

/**
 * Searches the specified log text for a match and returns the JSON object match.
 * @param {String} logtext - The log text to parse
 * @param {String} logSpecifier -The class/function name syntax to search for (ex. "PlayerInventory.GetPlayerCardsV3")
 * @returns {Object} The JSON object that is the result of the match.
 */
export function parseLog(logtext, logSpecifier) {
  // const LOG_LINE_PATTERN = /\[UnityCrossThreadLogger\](.*)\n([<=]=[=>]) (.*)\(.*\)\s*({\n(?:\s+.*,?\n)*})/g; // window

  const LOG_LINE_PATTERN = /\[UnityCrossThreadLogger\](.*)\r\n([<=]=[=>]) (.*)\(.*\)\s*({\r\n(?:\s+.*,?\r\n)*})/g; // mac

  let data;

  //rewards data
  let match;
  do {
    match = LOG_LINE_PATTERN.exec(logtext);
    if (match) {
      //console.log("Got match");
      if (match[3] === logSpecifier) {
        data = JSON.parse(match[4]);
      }
    }
  } while (match)

  return data;
}
/**
 * Generates the default path of the MTGA log file.
 * @returns the user's MTGA log path
 */
export function defaultLogUri() {

  if (process.platform !== "win32") {
    return (
      process.env.HOME +
      "/.wine/drive_c/user/" +
      process.env.USER +
      "/AppData/LocalLow/Wizards of the Coast/MTGA/output_log.txt"
    );
  }
  return process.env.APPDATA.replace(
    "Roaming",
    "LocalLow\\Wizards Of The Coast\\MTGA\\output_log.txt"
  );
}
/**
 * Calculates the amount and total possible amount of common, uncommon, rare, and mythic rares that the user has for all the sets available.
 * @param {Array<Object>} userCards - This is the JSON object containing a property with the mtga card key and the value with the number of cards
 * @param {Object} dbCards - This is a array of JSON objects containing all the card data pulled from scryfall.
 * @returns {Object} An object of MTGASet objects
 */
export function calculateSetTotals(userCards, dbCards) {

  const sets = {};
  dbCards.forEach(dbCard => {
    // If there is no set for this card, create it
    if (!sets[dbCard.set_name]) {
      const set = new MTGASet(dbCard.set_name);
      sets[dbCard.set_name] = set;
    }
    // Get the set of the current card
    const currentSet = sets[dbCard.set_name]
    // Add how many cards the user has to the set object, or zero if they don't have any
    if (userCards[dbCard.arena_id]) {
      currentSet.addRarity(dbCard.rarity, userCards[dbCard.arena_id]);
    } else {
      currentSet.addRarity(dbCard.rarity, 0);
    }
  });
  return sets;
}
