export async function load({ fetch, data }) {
    const artists = data.artists;
    const artistsWithEvents = [];
    // console.log(artists);

    for (const artist of artists) {
        
        const eventData = await getEvents(artist.id, artist.name, fetch);
        // console.log(JSON.stringify(eventData));
        artistsWithEvents.push({...artist, eventData: eventData});
    }
    // console.log(artistsWithEvents);

    return {
        artists: artistsWithEvents,
        profile: data.profile,
        player: data.player,
        // events: events
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