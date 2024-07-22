export async function load({ fetch, params, parent }) {

    const slug = params.artist;
    const { longTermArtists, mediumTermArtists, profile, player } = await parent();
    const artist = decodeURIComponent(slug);

    let artistInfo = longTermArtists.find((a: { name: string; }) => a.name === artist);
    if(!artistInfo) {
        artistInfo = mediumTermArtists.find((a: { name: string; }) => a.name === artist);
    }

    let key = 0;

    const artistWithEvents = [];
    const eventData = await getEvents(artistInfo.id, artistInfo.name, fetch);
    artistWithEvents.push({...artistInfo, eventData: eventData, key: ++key});

    return {
        artistWithEvents: artistWithEvents
    };
}

// search db using artist name and spotidy id as keywords
async function getEvents(spotifyID: string, artist: string, fetch: typeof window.fetch): Promise<any> {

    const encArtist = encodeURIComponent(artist);
    const encSpotifyID = encodeURIComponent(spotifyID);

    const apiUrl = `http://localhost:3000/api/search?spotifyID=${encSpotifyID}&artistName=${encArtist}`;
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