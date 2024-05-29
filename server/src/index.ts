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
import { db, initializeDatabase, insertEvents, deleteTemp, swapState, TicketMasterEvent } from "./database.js";
import { getEvents } from "./ticketmaster.js";
import { dmas } from "./constants.js";

config();
initializeDatabase();
// swapState();

const refreshTime = (12 * 60 * 60 * 1000); //5 hours
const mirmir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchAndStore() {
    try {
        deleteTemp();
        for (const dma in dmas) {
            console.log(`fetching for ${dma}`);
            const events = await getEvents(Number(dma));
            insertEvents(events);
            console.log(`inserted ${events.length} events`);
        }
    } catch (error) {
        console.log("error in fetch and store", error);
    }
}

fetchAndStore();


// setInterval(fetchAndStore, refreshTime);
