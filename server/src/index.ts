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
import { db, initializeDatabase, insertEvent, deleteTempEvents, swapState, updatePageNumber, updateTotalPages, TicketMasterEvent } from "./database.js";
import { getEventsForPage, getTotalPages } from "./ticketmaster.js";

config();
initializeDatabase();
swapState();

const refreshTime = (5 * 60 * 60 * 1000); //5 hours

async function fetchAndStore() {
    try {
        deleteTempEvents();

        let pageNumber: number | undefined = 0;
        while(pageNumber !== undefined) {
            let events: [TicketMasterEvent[], number?] = await getEventsForPage();
            pageNumber = events[1];
            
        }


        const totalPages = getTotalPages();
        updateTotalPages(totalPages);


        
        
    } catch (error) {
        
    }
}

// fetchAndStore();
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