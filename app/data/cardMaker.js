const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const app = remote.app;
const request = require('request');
export const ARENA_CARDS_FILENAME = 'arena-cards.json';
export const ARENA_CARDS_PATH = `${app.getPath('userData')}\\${ARENA_CARDS_FILENAME}`;
export const SCRYFALL_CARDS_FILENAME = 'scryfall-default-cards.json';
export const SCRYFALL_CARDS_PATH = `${app.getPath('userData')}\\${SCRYFALL_CARDS_FILENAME}`;
export const SCRYFALL_CARDS_URL = 'https://archive.scryfall.com/json/scryfall-default-cards.json'

export function checkAndDownloadCards(callback) {
  fs.access(ARENA_CARDS_PATH, fs.constants.R_OK, (err) => {
    console.log(`${ARENA_CARDS_PATH} ${err ? 'is not readable' : 'is readable'}`);
    if (err) {
      downloadNewCards(callback);
    } else {
      callback();
    }
  });
}

/**
 * Purges all the unused cards in the scryfall card list to include only those with arena_ids, then writes it to a file
 */
function purge(callback) {
  console.log('Reading scryfall list');
  let scryfall_list = JSON.parse(fs.readFileSync(SCRYFALL_CARDS_PATH, 'utf-8'));

  // Flip the list so it is in ID order (by default is in reverse order)
  // Grab 3 letter sets only and cards that have an arena id
  let refined_list = JSON.stringify(scryfall_list.filter(card => card.arena_id && card.set.length == 3).reverse());
  console.log('Writing arena list');
  fs.writeFileSync(ARENA_CARDS_PATH, refined_list, 'utf-8');
  console.log('Finished writing arena list');
  callback();
}

/**
 * Downloads the list of cards from the scryfall API
 */
function downloadNewCards(callback) {
  request(SCRYFALL_CARDS_URL)
    .pipe(fs.createWriteStream(SCRYFALL_CARDS_PATH).on('finish', () => {
      console.log('Purging scryfall list');
      purge(callback);
    }));
}
