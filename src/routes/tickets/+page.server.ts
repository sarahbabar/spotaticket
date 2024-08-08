export async function load({ fetch, parent }) {

    const { longTermArtists, mediumTermArtists, profile} = await parent();

    let key = 0;

    async function getArtistsWithEvents(artistList: any) {
        const artistsWithEvents = [];

        for (const artist of artistList) {
            const eventData = await getEvents(artist.id, artist.name, fetch);
            // console.log(JSON.stringify(eventData));
            artistsWithEvents.push({...artist, eventData: eventData, key: ++key});
        }
        return artistsWithEvents;
    }

    const [longTermArtistsEvents, mediumTermArtistsEvents] = await Promise.all([
        getArtistsWithEvents(longTermArtists), 
        getArtistsWithEvents(mediumTermArtists)
    ]);

    return {
        longTermArtists: longTermArtistsEvents,
        mediumTermArtists: mediumTermArtistsEvents,
        profile: profile
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