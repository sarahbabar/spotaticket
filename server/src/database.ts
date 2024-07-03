import Database from "better-sqlite3";

let mainTable = "1";
let tempTable = "2";

export const db = new Database("eventsdata.db");


export const initializeDatabase = () => {
    // 2 tables to hold info about events, 1 to read from while/when the other is being updated
    const createEvents1Query = `
        CREATE TABLE IF NOT EXISTS events1 (
            id TEXT PRIMARY KEY,
            name TEXT,
            url TEXT,
            date TEXT,
            dma INTEGER,
            country TEXT,
            city TEXT,
            venue TEXT,
            longitude TEXT,
            latitude TEXT
        )
    `;
    const createEvents2Query = `
        CREATE TABLE IF NOT EXISTS events2 (
            id TEXT PRIMARY KEY,
            name TEXT,
            url TEXT,
            date TEXT,
            dma INTEGER,
            country TEXT,
            city TEXT,
            venue TEXT,
            longitude TEXT,
            latitude TEXT
        )
    `;
    // state table to let us know which events and attractions tables can be read from
    const createStateQuery = `
        CREATE TABLE IF NOT EXISTS state (
            table_number TEXT PRIMARY KEY,
            is_main INTEGER,
            dma_id TEXT,
            time_stamp INTEGER
        )
    `;
    // 2 tables to hold info about attractions (artists), 1 to read from while/when the other is being updated
    // single events may have multiple attractions
    const createAttractions1Query = `
        CREATE TABLE IF NOT EXISTS attractions1 (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            artist_name TEXT,
            artist_url TEXT,
            artist_id TEXT,
            spotify_id TEXT
        )
    `;
    const createAttractions2Query = `
        CREATE TABLE IF NOT EXISTS attractions2 (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            artist_name TEXT,
            artist_url TEXT,
            artist_id TEXT,
            spotify_id TEXT
        )
    `;
    const deleteOauthQuery = `
        DROP TABLE IF EXISTS oauth
    `;

    const createOAuthQuery = `
        CREATE TABLE IF NOT EXISTS oauth (
            id TEXT PRIMARY KEY,
            access_token TEXT,
            refresh_token TEXT,
            token_type TEXT,
            expires_in INTEGER,
            time_stamp INTEGER
        )
    `;
    const initialStateQuery1 = `
        INSERT OR IGNORE INTO state (table_number, is_main, dma_id, time_stamp)
        VALUES ('1', TRUE, '', 0)
    `;
    const initialStateQuery2 = `
        INSERT OR IGNORE INTO state (table_number, is_main, dma_id , time_stamp)
        VALUES ('2', FALSE, '', 0)
    `;

    db.prepare(createEvents1Query).run();
    db.prepare(createEvents2Query).run();
    db.prepare(createAttractions1Query).run();
    db.prepare(createAttractions2Query).run();
    db.prepare(createStateQuery).run();
    // db.prepare(deleteOauthQuery).run();
    db.prepare(createOAuthQuery).run();
    db.prepare(initialStateQuery1).run();
    db.prepare(initialStateQuery2).run();

    const getMainQuery = `
        SELECT table_number 
        FROM state
        WHERE is_main = TRUE
    `;

    let tableNumber = db.prepare(getMainQuery).pluck().get() as string;

    mainTable = tableNumber;
    tempTable = (mainTable === '1') ? '2' : '1';

    // mainAttrTable = "attractions".concat(tableNumber);
    // tempAttrTable = (mainEventsTable === 'attractions1') ? 'attractions2' : 'attractions1';
};

initializeDatabase();

export type TicketMasterEvent = {
    id: string,
    name: string,
    url: string,
    date: string,
    dma: number,
    country: string,
    city: string,
    venue: string,
    longitude: string,
    latitude: string,
    attractions: TicketMasterAttraction[]
};

export type TicketMasterAttraction = {
    id: string,
    event_id: string,
    artist_name: string,
    artist_id: string,
    artist_url: string,
    spotify_id: string
};

const easternTime = new Date().toLocaleTimeString("en-US", {timeZone: 'America/New_York'});

// insert concert events and attractions into the the temp tables for each
export const insertEvents = (events: TicketMasterEvent[]) => {
    const insertEventsQuery = `
        INSERT OR REPLACE INTO events${tempTable} (id, name, url, date, dma, country, city, venue, longitude, latitude)
        VALUES (@id, @name, @url, @date, @dma, @country, @city, @venue, @longitude, @latitude)
    `;
    const insertAttrQuery = `
        INSERT OR REPLACE INTO attractions${tempTable} (id, event_id, artist_name, artist_id, artist_url, spotify_id)
        VALUES (@id, @event_id, @artist_name, @artist_id, @artist_url, @spotify_id)
    `;
    const updateTimeStamp = `
        UPDATE state
        SET time_stamp = ${Date.now()}
        WHERE is_main = FALSE
    `;
    const prepInsertEvents = db.prepare(insertEventsQuery);
    const prepInsertAttr = db.prepare(insertAttrQuery);
    const prepUpdateTimeStamp = db.prepare(updateTimeStamp);
    const insertMany = db.transaction((events) => {
        prepUpdateTimeStamp.run();
        for (const event of events) {
            prepInsertEvents.run(event);

            for (const attraction of event.attractions) {
                prepInsertAttr.run(attraction);
            }
        }
    });
    insertMany(events);
};

// swap main and temp table numbers in the state table
export const swapState = () => {
    const updateStateQuery = `
        UPDATE state 
        SET is_main = CASE
            WHEN table_number = @name THEN FALSE
            ELSE TRUE
        END
    `;
    db.prepare(updateStateQuery).run({name: mainTable});
    // if mainTable is 1 then set it to 2, else 1
    mainTable = (mainTable === '1') ? '2' : '1';
    tempTable = (mainTable === '1') ? '2' : '1';
};

// delete concert events and attractions from the temp tables for each, reset time stamp in state table to 0 as empty tables
export const deleteTemp = () => {
    const deleteEventsQuery = `DELETE FROM events${tempTable}`;
    const deleteAttrQuery = `DELETE FROM attractions${tempTable}`;
    const prepDeleteEvents = db.prepare(deleteEventsQuery);
    const prepDeleteAttr = db.prepare(deleteAttrQuery);
    const changeStateQuery = `
        UPDATE state
        SET dma_id = '',
            time_stamp = 0
        WHERE
            table_number = @tempTable
    `;
    const prepChange = db.prepare(changeStateQuery);
    const runQuery = db.transaction(() => {
        prepDeleteEvents.run();
        prepDeleteAttr.run();
        prepChange.run({ tempTable });
    })
    runQuery();
};

export type OAuthData = {
    id: string,
    access_token: string,
    refresh_token: string,
    token_type: string,
    expires_in: number,
    time_stamp: number
};

const insertOAuthQuery = `
        INSERT OR REPLACE INTO oauth (id, access_token, refresh_token, token_type, expires_in, time_stamp)
        VALUES (@id, @access_token, @refresh_token, @token_type, @expires_in, @time_stamp)
    `;
const insertPrep = db.prepare(insertOAuthQuery);

export const insertOAuthData = (oauthData: OAuthData) => {
    insertPrep.run(oauthData);
};

const selectQuery = `
        SELECT *
        FROM oauth
        WHERE oauth.id = ?
    `;
const selectStmt = db.prepare(selectQuery);

export const searchOAuthData = (uid: string) => {
    const oauthData = selectStmt.get(uid);
    return oauthData;
};

const deleteQuery = `
    DELETE FROM oauth 
    WHERE oauth.id = ?
`;

const prepDelete = db.prepare(deleteQuery);

export const deleteOAuthUser = (uid: string) => {
    prepDelete.run(uid);
};

// search using keyword (spotify ID and artist name)
export const searchTable = (spotifyID: string, artistName: string) => {
    const selectQuery = `
        SELECT events${mainTable}.*, attractions${mainTable}.*
        FROM events${mainTable}
        JOIN attractions${mainTable} ON attractions${mainTable}.event_id = events${mainTable}.id
        WHERE attractions${mainTable}.spotify_id = ? OR attractions${mainTable}.artist_name = ?
    `;
    const selectStmt = db.prepare(selectQuery);
    const events = selectStmt.all(spotifyID, artistName);
    return events;
    // console.log(events);
    // console.log(events.length);
};

const deleteExpiredQuery = `
        DELETE FROM oauth 
        WHERE (@currentTime >= (oauth.time_stamp + oauth.expires_in)) 
`;
const prepExpiredDelete = db.prepare(deleteExpiredQuery);

export const deleteExpired = () => {
    const currentTime = Date.now()/1000;

    prepExpiredDelete.run({currentTime});
}