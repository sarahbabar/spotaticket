import express from "express";
// @ts-ignore
import { handler } from "../../build/handler.js";

const app = express();

// add a route that lives separately from the SvelteKit app
app.get('/helloworld', (req, res) => {
    res.end('ok');
});

app.use(handler);

app.listen(3000, () => {
    console.log('listening on port 3000');
});