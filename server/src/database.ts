import Database from "better-sqlite3";

let mainTable = 'events1';
let tempTable = 'events2';

export const db = new Database("eventsdata.db");

export const initializeDatabase = () => {

    const createEvents1Query = `
        CREATE TABLE IF NOT EXISTS events1 (
            id TEXT PRIMARY KEY,
            name TEXT,
            url TEXT,
            date INTEGER,
            country TEXT,
            city TEXT,
            venue TEXT
        )
    `;
    const createEvents2Query = `
        CREATE TABLE IF NOT EXISTS events2 (
            id TEXT PRIMARY KEY,
            name TEXT,
            url TEXT,
            date INTEGER,
            country TEXT,
            city TEXT,
            venue TEXT
        )
    `;
    const createStateQuery = `
        CREATE TABLE IF NOT EXISTS state (
            table_name TEXT PRIMARY KEY,
            is_main INTEGER,
            page_number INTEGER,
            total_pages INTEGER,
            time_stamp INTEGER
        )
    `;
    const initialStateQuery1 = `
        INSERT OR IGNORE INTO state (table_name, is_main, page_number, total_pages, time_stamp)
        VALUES ('events1', TRUE, 0, 0, 0)
    `;
    const initialStateQuery2 = `
        INSERT OR IGNORE INTO state (table_name, is_main, page_number, total_pages, time_stamp)
        VALUES ('events2', FALSE, 0, 0, 0)
    `;

    db.prepare(createEvents1Query).run();
    db.prepare(createEvents2Query).run();
    db.prepare(createStateQuery).run();
    db.prepare(initialStateQuery1).run();
    db.prepare(initialStateQuery2).run();

    const getMainQuery = `
        SELECT table_name 
        FROM state
        WHERE is_main = TRUE
    `;

    mainTable = db.prepare(getMainQuery).pluck().get() as string;
    tempTable = (mainTable === 'events1') ? 'events2' : 'events1';
};

export type TicketMasterEvent = {
    id: string,
    name: string,
    url: string,
    date: number,
    country: string,
    city: string,
    venue: string
};

export const insertEvent = (event: TicketMasterEvent) => {
    const insertQuery = `
        INSERT OR REPLACE INTO ${tempTable} (id, name, url, date, country, city, venue)
        VALUES (@id, @name, @url, @date, @country, @city, @venue)
    `;
    db.prepare(insertQuery).run(event);
};

export const insertEvents = (events: TicketMasterEvent[]) => {
    const insertQuery = `
        INSERT OR REPLACE INTO ${tempTable} (id, name, url, date, country, city, venue)
        VALUES (@id, @name, @url, @date, @country, @city, @venue)
    `;
    const prepInsert = db.prepare(insertQuery);
    const insertMany = db.transaction((events) => {
        for (const event of events) {
            prepInsert.run(event)
        }
    });
    insertMany(events);
};

export const swapState = () => {
    const updateStateQuery = `
        UPDATE state 
        SET is_main = CASE
            WHEN table_name = @name THEN FALSE
            ELSE TRUE
        END
    `;
    db.prepare(updateStateQuery).run({name: mainTable});
    mainTable = (mainTable === 'events1') ? 'events2' : 'events1';
    tempTable = (mainTable === 'events1') ? 'events2' : 'events1';
};

export const updatePageNumber = (pageNumber: number) => {
    const updatePageQuery = `
        UPDATE state 
        SET page_number = @pageNumber
    `;
    db.prepare(updatePageQuery).run({pageNumber});
};

export const updateTotalPages = (pages: number) => {
    const updateTotalPagesQuery = `
        UPDATE state
        SET total_pages = @pages
    `;
    db.prepare(updateTotalPagesQuery).run({pages});
};

export const deleteTempEvents = () => {

    const deleteQuery = `DELETE FROM ${tempTable}`;
    const prepDelete = db.prepare(deleteQuery);
    const changeStateQuery = `
        UPDATE state
        SET page_number = 0,
            total_pages = 0,
            time_stamp = 0
        WHERE
            table_name = @tempTable
    `;
    const prepChange = db.prepare(changeStateQuery);
    const runQuery = db.transaction(() => {
        prepDelete.run();
        prepChange.run({ tempTable });
    })
    runQuery();
};


