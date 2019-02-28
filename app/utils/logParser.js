export function parseLog (logtext, logSpecifier){
    const LOG_LINE_PATTERN = /\[UnityCrossThreadLogger\](.*)\n([<=]=[=>]) (.*)\(.*\)\s*({\n(?:\s+.*,?\n)*})/g; // window

    // const LOG_LINE_PATTERN = /\[UnityCrossThreadLogger\](.*)\r\n([<=]=[=>]) (.*)\(.*\)\s*({\r\n(?:\s+.*,?\r\n)*})/g; // mac

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