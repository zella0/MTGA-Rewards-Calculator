const fs = require('fs');
const path = require('path');

/**
 * Purges all the unused cards in the scryfall card list to include only those with arena_ids, then writes it to a file
 */
function purge() {
    const PATH_TO_SCRYFALL_CARDS = `${path.resolve(__dirname)}\\scryfall-default-cards.json`
    let scryfall_list = JSON.parse(fs.readFileSync(PATH_TO_SCRYFALL_CARDS, 'utf-8'));
    //Flip the list so it is in ID order (by default is in reverse order)
    let refined_list = JSON.stringify(scryfall_list.filter(card => card.arena_id).reverse());
    const ARENA_CARDS_PATH = `${path.resolve(__dirname)}\\arena-cards.json`;
    fs.writeFileSync(ARENA_CARDS_PATH, refined_list, 'utf-8');
}

/**
 * Downloads the list of cards from the scryfall API
 */
function downloadNewCards() {
    //TODO
}

purge();