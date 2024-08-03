export async function load({ fetch, params, parent }) {

    const slug = params.artist;
    const { longTermArtists, mediumTermArtists, profile } = await parent();
    const artist = decodeURIComponent(slug);

    let artistInfo = longTermArtists.find((a: { name: string; }) => a.name === artist);
    if (!artistInfo) {
        artistInfo = mediumTermArtists.find((a: { name: string; }) => a.name === artist);
    }
    
    if (!artistInfo) {
        return { artistWithEvents: {id: "", name: artist, eventData: []} };
    }

    const eventData = await getEvents(artistInfo.id, artistInfo.name, fetch);
    const artistWithEvents = {...artistInfo, eventData: eventData};

    return {
        artistWithEvents: artistWithEvents
    };
}

// search db using artist name and spotidy id as keywords
async function getEvents(spotifyID: string, artist: string, fetch: any): Promise<any> {

    const encArtist = encodeURIComponent(artist);
    const encSpotifyID = encodeURIComponent(spotifyID);

    const apiUrl = `/api/search?spotifyID=${encSpotifyID}&artistName=${encArtist}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET'
        });
        if (!response.ok) {
            console.log("something went wrong in getting events ;-;", response.status);
            return {};
        }
        const eventData = await response.json();
        return eventData;
    } catch (error) {
        console.log(error);
    }
}