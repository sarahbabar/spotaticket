import Database from "better-sqlite3";

// let mainEventsTable = 'events1';
// let tempEventsTable = 'events2';
// let mainAttrTable = 'attractions1';
// let tempAttrTable = 'attractions2';

let mainTable = "1";
let tempTable = "2";

export const db = new Database("eventsdata.db");

export const initializeDatabase = () => {

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
    const createStateQuery = `
        CREATE TABLE IF NOT EXISTS state (
            table_number TEXT PRIMARY KEY,
            is_main INTEGER,
            dma_id TEXT,
            time_stamp INTEGER
        )
    `;
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
}

// export const insertEvent = (event: TicketMasterEvent) => {
//     const insertQuery = `
//         INSERT OR REPLACE INTO events${tempTable} (id, name, url, date, dma, country, city, venue, longitude, latitude)
//         VALUES (@id, @name, @url, @date, @dma, @country, @city, @venue, @longitude, @latitude)
//     `;
//     db.prepare(insertQuery).run(event);
// };

export const insertEvents = (events: TicketMasterEvent[]) => {
    const insertEventsQuery = `
        INSERT OR REPLACE INTO events${tempTable} (id, name, url, date, dma, country, city, venue, longitude, latitude)
        VALUES (@id, @name, @url, @date, @dma, @country, @city, @venue, @longitude, @latitude)
    `;
    const insertAttrQuery = `
        INSERT OR REPLACE INTO attractions${tempTable} (id, event_id, artist_name, artist_id, artist_url, spotify_id)
        VALUES (@id, @event_id, @artist_name, @artist_id, @artist_url, @spotify_id)
    `;
    const prepInsertEvents = db.prepare(insertEventsQuery);

    const prepInsertAttr = db.prepare(insertAttrQuery);
    const insertMany = db.transaction((events) => {
        for (const event of events) {
            prepInsertEvents.run(event);

            for (const attraction of event.attractions) {
                prepInsertAttr.run(attraction);
            }
        }
    });
    insertMany(events);
};

// export const insertAttractions = (attractions: TicketMasterAttraction[]) => {
//     const insertQuery = `
//         INSERT OR REPLACE INTO attractions${tempTable} (attraction_id, event_id, artist_name, artist_id, event_url, spotigy_id)
//         VALUES (@attraction_id, @event_id, @artist_name, @artist_id, @event_url, @spotigy_id)
//     `;
//     const prepInsert = db.prepare(insertQuery);
//     const insertMany = db.transaction((attractions) => {
//         for (const attraction of attractions) {
//             prepInsert.run(attraction)
//         }
//     });
//     insertMany(attractions);
// };

export const swapState = () => {
    const updateStateQuery = `
        UPDATE state 
        SET is_main = CASE
            WHEN table_number = @name THEN FALSE
            ELSE TRUE
        END
    `;
    db.prepare(updateStateQuery).run({name: mainTable});
    mainTable = (mainTable === '1') ? '2' : '1';
    tempTable = (mainTable === '1') ? '2' : '1';
};

// export const updatePageNumber = (pageNumber: number) => {
//     const updatePageQuery = `
//         UPDATE state 
//         SET page_number = @pageNumber
//     `;
//     db.prepare(updatePageQuery).run({pageNumber});
// };

// export const updateTotalPages = (pages: number) => {
//     const updateTotalPagesQuery = `
//         UPDATE state
//         SET total_pages = @pages
//     `;
//     db.prepare(updateTotalPagesQuery).run({pages});
// };

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


