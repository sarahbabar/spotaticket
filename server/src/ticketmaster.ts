import { TicketMasterEvent } from "./database.js";

// export async function getEvent() {
    
//     const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=200&countryCode=CA&apikey=${process.env.TICKETMASTER_API_KEY}`);
//     const data = await response.json();

//     let currentPage = data.page.number;
//     const dataArr = [data];

//     const mirmir = (ms: number) => new Promise((r) => setTimeout(r, ms));

//     while (currentPage < data.page.totalPages) {
//         currentPage++;
//         const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=200&page=${currentPage}&countryCode=CA&apikey=${process.env.TICKETMASTER_API_KEY}`);
//         const nextPageData = await response.json();
//         try {
//             const filteredEvents = formatData(nextPageData);
//             dataArr.push(filteredEvents);
//         } 
//         catch (error) {
//             continue;
//         }
//         await mirmir(300);
//     }
//     return dataArr;
// }

let totalPages = 0;

export async function getEventsForPage(pageNumber: number = 0): Promise<[TicketMasterEvent[], number?]> {

    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=200&page=${pageNumber}&countryCode=CA&apikey=${process.env.TICKETMASTER_API_KEY}`);
    
    // if something went wrong with the request, return the same page number to try again
    if (!response.ok) {
        return [[], pageNumber];
    }
    const pageData = await response.json();
    const formattedData = formatData(pageData);

    totalPages = pageData.page.totalPages;

    if (totalPages >= pageNumber) {
        return [formattedData, undefined];
    }
    return [formattedData, pageNumber++];
} 

export function getTotalPages(): number {
    return totalPages;
}

function formatData(res: any): TicketMasterEvent[] {
    const filteredEvents = [];
    const rawEvents = res._embedded.events;
    
    for (let i = 0; i < rawEvents.length; i++) {
        try {
            const {name: eventName, id, url, dates: {start: {localDate}}, _embedded: {venues:[{name: venueName, city: {name: cityName}, country: {countryCode}}]}} = rawEvents[i];
            
            if ([eventName, id, url, localDate, venueName, cityName, countryCode].some((v) => v === undefined)) {
                continue
            }

            filteredEvents.push({
                id,
                name: eventName,
                url,
                date: new Date(localDate).getTime()/1000,
                country: countryCode,
                city: cityName,
                venue: venueName
            });
        } 
        catch (error) {
            continue;
        }
    }
    return filteredEvents;
}