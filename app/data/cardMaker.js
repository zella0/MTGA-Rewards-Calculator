const fs = require('fs');
const path = require('path');

function purge() {
    let scryfall_list = JSON.parse(fs.readFileSync(`${path.resolve(__dirname)}\\scryfall-default-cards.json`, 'utf-8'));
    let refined_list = JSON.stringify(scryfall_list.filter(card => card.arena_id).reverse());
    fs.writeFileSync(`${path.resolve(__dirname)}\\arena-cards.json`, refined_list, 'utf-8');
}

function downloadNewCards() {
    //TODO
}

purge();