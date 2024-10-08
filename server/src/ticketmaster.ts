import { TicketMasterEvent } from "./database.js";
import { genres } from "./constants.js";

const mirmir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchEvent(dmaID: number, page: number, order: "asc" | "desc" = "asc", genreID: string = ""): Promise<{events: TicketMasterEvent[], totalPages: number, totalElements: number}>  {
    
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=200&segmentName=Music&source=ticketmaster&sort=name,${order}&page=${page}&dmaId=${dmaID}&apikey=${process.env.TICKETMASTER_API_KEY}`;

    if (genreID) {
        url += `&genreId=${genreID}`;
    }
    try {
        const response = await fetch(url);
        await mirmir(210);

        if(!response.ok) {

            console.log(`error in fetchEvent:\n\tstatus: ${response.status}\n\turl: ${url}`)
        }
        const data = await response.json();
        let totalPages = data.page.totalPages;
        let totalElements = data.page.totalElements;
        return {events: formatData(data, dmaID), totalPages, totalElements};

    } catch (error) {
        console.log(`something went wrong in fetchEvent:\nurl: ${url}\nerror: ${error}`);
        return {events: [], totalPages: 0, totalElements: 0};
    }
}

// given a dma ID, make the necessary request
export async function getEvents(dmaID: number, genreID: string = ""): Promise<TicketMasterEvent[]>  {

    // make the initial request to get the # of elements & pages
    let {events, totalPages, totalElements} = await fetchEvent(dmaID, 0, "asc", genreID);

    // if # of elements is <= 1000, ascending pagination
    if (totalElements <= 1000) {
        const eventsAsc = await getEventsByPage(dmaID, 1, totalPages, "asc", genreID);
        return events.concat(eventsAsc); 
    }

    // if # of elements is > 1000 and <= 2000, ascending + descending pagination
    if (totalElements > 1000 && totalElements <= 2000) {
        // by default if > 1000 elements, will always have to check 5 pages ascending
        const eventsAsc = await getEventsByPage(dmaID, 1, 5, "asc", genreID);
        const eventsDesc = await getEventsByPage(dmaID, 0, (totalPages-5), "desc", genreID);
        return events.concat(eventsAsc, eventsDesc);
    }

    // if # of elements is > 2000, genre ID requests
    if (genreID === "") {

        if (totalElements > 2000) {
            for (let key in genres) {
                const eventsByGenre = await getEvents(dmaID, key);
                events = events.concat(eventsByGenre);
            }
        }
    }
    else {
        const eventsAsc = await getEventsByPage(dmaID, 1, 5, "asc", genreID);
        const eventsDesc = await getEventsByPage(dmaID, 0, 5, "desc", genreID);
        return events.concat(eventsAsc, eventsDesc);
    }
    return events;
}

async function getEventsByPage(dmaID: number, page: number, totalPages: number, order: "asc" | "desc" = "asc", genreID: string = ""): Promise<TicketMasterEvent[]> {

    let eventsArr: TicketMasterEvent[] = [];

    for (let p = page; p < totalPages; p++) {
        const {events} = await fetchEvent(dmaID, p, order, genreID);
        eventsArr = eventsArr.concat(events);
    }
    return eventsArr;
}

function formatData(res: any, dma: number): TicketMasterEvent[] {
    let skip = 0;
    const filteredEvents = [];
    const regex = /artist\/(.*?)(?:\?|$)/;
    
    try {
        const _ = res._embedded.events;
    } catch (error) {
        console.log("no events in dma", dma); // could also be b/c of no event for specific genre
        return [];
    }
    const rawEvents = res._embedded.events;
    const match = (str: string, regex: any) => {
        const m = regex.exec(str);
        return m ? m[1] : ""};

    for (let i = 0; i < rawEvents.length; i++) {
        try {
            const {name: eventName, id, url, dates: {start: {localDate}}, _embedded: {venues:[{name: venueName, city: {name: cityName}, country: {countryCode}, location: {longitude, latitude}}], attractions}} = rawEvents[i];
            
            if ([eventName, id, url, localDate, venueName, cityName, countryCode, longitude, latitude, attractions].some((v) => v === undefined)) {
                continue
            }

            const attractionsList = [];

            for (const attraction of attractions) {
                const {name: artist_name, id: artist_id, url: artist_url, externalLinks} = attraction;

                let spotify_id = "";

                if (externalLinks && externalLinks.spotify) {
                    spotify_id = match(externalLinks.spotify[0].url, regex);
                }

                attractionsList.push({
                    id: id.concat(artist_id), 
                    event_id: id,
                    artist_name,
                    artist_id,
                    artist_url,
                    spotify_id
                });
            }
            // fix date/incorrect
            filteredEvents.push({
                id,
                name: eventName,
                url,
                date: localDate,
                dma,
                country: countryCode,
                city: cityName,
                venue: venueName,
                longitude,
                latitude,
                attractions: attractionsList
            });
        } 
        catch (error) {
            skip++;
            continue;
        }
    }
    if (skip > 0) {
        console.log(`skipped ${skip} from ${dma}\n`);
    }
    return filteredEvents;
}
