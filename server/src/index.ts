import express from "express";
import cors from 'cors';
// @ts-ignore
import { handler } from "../../build/handler.js";
import { config } from "dotenv";
import { db, initializeDatabase, insertEvents, deleteTemp, swapState, TicketMasterEvent, searchTable, insertOAuthData, searchOAuthData, deleteOAuthUser, deleteExpired, testFun } from "./database.js";
import { getEvents } from "./ticketmaster.js";
import { dmas } from "./constants.js";


config();
const app = express();
app.use(cors());

app.get('/api/search', (req, res) => {
    const { spotifyID, artistName } = req.query;
    console.log(`spotifyID:${spotifyID}\nartistName:${artistName}`);
    // check if spotifyID and artistName are given
    if (!spotifyID || !artistName) {
        return res.status(400).send('Missing spotify ID or atist name');
    }
    try {
        const searchResults = searchTable(spotifyID as string, artistName as string);
        res.json(searchResults);
    } catch (error) {
        res.status(500).send('internal server error');
    }
});

app.get('/oauth/:uid', (req, res) => {
    if (req.headers.token !== process.env.ADMIN_KEY) {
        res.status(401).send('unauthorized');
        return
    }

    const uid = req.params.uid;
    console.log(`uid:${uid}`);

    if (!uid) {
        return res.status(400).send('Missing uid');
    }
    try {
        const searchResult = searchOAuthData(uid as string);
        // console.log("search result: ", searchResult);
        res.json(searchResult);
    } catch (error) {
        res.status(500).send('internal server error');
    }
});

app.post('/oauth', express.json({type: '*/*'}), (req, res) => {
    if (req.headers.token !== process.env.ADMIN_KEY) {
        res.status(401).send('unauthorized');
        return
    }

    const oauthData = req.body;

    if( 
        (oauthData.id === undefined) || (oauthData.access_token === undefined) || 
        (oauthData.refresh_token === undefined) || (oauthData.token_type === undefined) || 
        (oauthData.expires_in === undefined) || (oauthData.time_stamp === undefined)) {
        return res.status(400).send('Missing some data');
    }
    try {
        insertOAuthData(oauthData);
    } catch (error) {
        return res.status(500).send('internal server error');
    }
    return res.send("set");
});

app.delete('/oauth/:uid', (req, res) => {
    if (req.headers.token !== process.env.ADMIN_KEY) {
        res.status(401).send('unauthorized');
        return
    }
    const uid = req.params.uid;
    console.log("deleting ", uid);

    if (!uid) {
        return res.status(400).send('Missing uid');
    }
    try {
        deleteOAuthUser(uid as string);
        res.send("deleted");
    } catch (error) {
        res.status(500).send('internal server error');
    }
});

app.use(handler);

app.listen(3000, () => {
    console.log('listening on port 3000');
});

//swapState();

// when refreshing/clearing db also check for expired tokens 
// deleteExpired();

const refreshTime = (12 * 60 * 60 * 1000); //12 hours
// const mirmir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchAndStore() {
    deleteTemp();
    for (const dma in dmas) {
        try {
            console.log(`fetching for ${dma}`);
            const events = await getEvents(Number(dma));
            insertEvents(events);
            console.log(`inserted ${events.length} events`);
        } catch (error) {
            console.log("error in fetch and store", error);
            return false;
        }    
    }
    return true;
}

async function refreshDB() {
    console.log("starting data refresh");
    try {
        deleteExpired();
        if (await fetchAndStore()) {
            swapState();
        }
    } catch (error) {
        console.log("something went wrong during data refresh L");
    }
}

console.log("meow");
// setInterval(refreshDB, refreshTime);

// fetchAndStore();

// searchTable('.', 'Vampire Weekend');

// setInterval(fetchAndStore, refreshTime);
