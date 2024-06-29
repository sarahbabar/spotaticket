import express from "express";
// @ts-ignore
import { handler } from "../../build/handler.js";
import { config } from "dotenv";
import { db, initializeDatabase, insertEvents, deleteTemp, swapState, TicketMasterEvent, searchTable, insertOAuthData, searchOAuthData } from "./database.js";
import { getEvents } from "./ticketmaster.js";
import { dmas } from "./constants.js";

config();
initializeDatabase();

const app = express();

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
    const uid = req.params.uid;
    console.log(`uid:${uid}`);

    if (!uid) {
        return res.status(400).send('Missing uid');
    }
    try {
        const searchResults = searchOAuthData(uid as string);
        res.json(searchResults);
    } catch (error) {
        res.status(500).send('internal server error');
    }
});

app.post('/oauth', express.json({type: '*/*'}), (req, res) => {
    const oauthData = req.body;

    if(!oauthData.id || !oauthData.access_token || !oauthData.refresh_token || !oauthData.token_type || !oauthData.expires_in) {
        return res.status(400).send('Missing some data');
    }
    try {
        insertOAuthData(oauthData);
    } catch (error) {
        return res.status(500).send('internal server error');
    }
    return res.send("set");
});

app.use(handler);

app.listen(3000, () => {
    console.log('listening on port 3000');
});

//swapState();

// when refreshing/clearing db also check for expired tokens 

const refreshTime = (12 * 60 * 60 * 1000); //12 hours
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

// fetchAndStore();

// searchTable('.', 'Vampire Weekend');

// setInterval(fetchAndStore, refreshTime);
