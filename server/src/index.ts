// import express from "express";
// // @ts-ignore
// import { handler } from "../../build/handler.js";

// const app = express();

// // add a route that lives separately from the SvelteKit app
// app.get('/helloworld', (req, res) => {
//     res.end('ok');
// });

// app.use(handler);

// app.listen(3000, () => {
//     console.log('listening on port 3000');
// });
import { config } from "dotenv";
import { db, initializeDatabase, insertEvents, deleteTempEvents, swapState, updatePageNumber, updateTotalPages, TicketMasterEvent } from "./database.js";
import { getEventsForPage } from "./ticketmaster.js";

config();
initializeDatabase();
// swapState();

const refreshTime = (5 * 60 * 60 * 1000); //5 hours
const mirmir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchAndStore() {
    try {
        deleteTempEvents();

        let pageNumber: number | undefined = 0;
        while(pageNumber !== undefined) {
            updatePageNumber(pageNumber);
            let events: [TicketMasterEvent[], number?] = await getEventsForPage(pageNumber);
            pageNumber = events[1];
            console.log("fetched", events[0].length, "page:", pageNumber);
            insertEvents(events[0]);
            await mirmir(300);
        }
    } catch (error) {
        console.log("error in fetch and store", error);
    }
}


fetchAndStore();


// setInterval(fetchAndStore, refreshTime);

// const testData = {
//     id: "1234",
//     name: "blessin jepsen",
//     url: "https://en.wikipedia.org/wiki/The_Office_(American_TV_series)",
//     date: Date.now(),
//     country: "CA",
//     city: "Toronto",
//     venue: "Danforth Music Hall"
// };