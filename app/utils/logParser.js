import { list } from "postcss";

export function parseLog (logtext, logSpecifier){
    // const LOG_LINE_PATTERN = /\[UnityCrossThreadLogger\](.*)\n([<=]=[=>]) (.*)\(.*\)\s*({\n(?:\s+.*,?\n)*})/g; // window

    const LOG_LINE_PATTERN = /\[UnityCrossThreadLogger\](.*)\r\n([<=]=[=>]) (.*)\(.*\)\s*({\r\n(?:\s+.*,?\r\n)*})/g; // mac

    let data;

    //rewards data
    let match;
    do {    
        match = LOG_LINE_PATTERN.exec(logtext);
        if(match) {
            console.log("Got match");
            if(match[3] === logSpecifier) {
                data = JSON.parse(match[4]);
            } 
        }
    } while(match)

    return data;
}

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

export function calcPayouts (userCards, dbCards) {

    let listOfSets = {};
    
    for(let i in dbCards) {
        if(!listOfSets[dbCards[i].set_name]) {
            let set = { name: dbCards[i].set_name, user_common: 0, total_common:0, user_uncommon:0, total_uncommon: 0, user_rare: 0, total_rare: 0, user_mythic: 0, total_mythic_rare: 0}
            listOfSets[dbCards[i].set_name] = set;
        }
        let current_set = listOfSets[dbCards[i].set_name]
        if(userCards[dbCards[i].arena_id]) {
            console.log(userCards[dbCards[i].arena_id])
            setCards(current_set, dbCards[i].rarity, dbCards[i].arena_id, userCards[dbCards[i].arena_id]);
        } else {
            setCards(current_set, dbCards[i].rarity, dbCards[i].arena_id, 0);
        }

    }
    console.log(listOfSets);

}

function setCards(set, rarity, arena_id, amount) {
    switch (rarity) {
        case 'common':
        set.user_common += amount;
        set.total_common += 4;
        break;
        case 'uncommon':
        set.user_uncommon += amount;
        set.total_uncommon += 4;
        break;
        case 'rare':
        set.user_rare += amount;
        set.total_rare += 4;
        break;
        case 'mythic':
        set.user_mythic += amount;
        set.total_mythic_rare += 4;
        break;
        default:
        // code block
        break;
    }
}