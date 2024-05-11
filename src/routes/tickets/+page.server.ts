import { NAMESPACE_KEY, TICKETMASTER_API_KEY } from '$env/static/private';
import { Namespace } from '$lib/namespace';
import { error, redirect } from '@sveltejs/kit';

const [get, set] = Namespace("sarah", NAMESPACE_KEY);

const artistURL = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0`;
const profileURL = `https://api.spotify.com/v1/me`;
const playerURL = `https://api.spotify.com/v1/me/player/currently-playing`;

export async function load({ cookies }) {

    const access_token = cookies.get("accessToken");

    if(!access_token) {
        // no access token, not logged in -> sent back home
        throw redirect(302, "/");
    }
    // otherwise
    try {
        const [artistData, profileData, playerData] = await Promise.all([
            getTopArtists(access_token),
            getProfile(access_token),
            getPlaying(access_token)
        ]);

        console.log(artistData);
        console.log(profileData);
        console.log(playerData);

        const artistNames: string[] = [];
        for (let i = 0; i < (artistData.items || []).length; i++) {
            const encodedName = encodeURIComponent(artistData.items[i].name);
            artistNames.push(encodedName);
        }

        const events = [];
        for (const artistName of artistNames) {
            
            const eventData = await getEvent(artistName);
            events.push(eventData);
        }
        
        console.log(artistNames);
        console.log(events);
        return {
            artists: artistData.items,
            profile: profileData,
            player: playerData
        };
    }
    catch(error) {
        console.log("womp womp", error);
        throw error;
    }
}

async function getEvent(artistName: string) {

    const eventStore = "ticketMaster".concat(artistName);
    const cachedEvent = await get(eventStore);
    
    if(cachedEvent !== null) {
        console.log("using cached", eventStore);
        return cachedEvent;
    }
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${artistName}&apikey=${TICKETMASTER_API_KEY}`);
    console.log("fetched");

    if(response.status === 429) {
        return {};
    }
    if(!response.ok) {
        await set(eventStore, {});
        return {};
    }
    const resp = await response.json();
    await set(eventStore, resp);
    return resp;
}

async function getTopArtists(accessToken: string): Promise<any> {

    const response = await fetch(artistURL, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if(!response.ok) {
        return {};
    }
    return await response.json();
}

async function getProfile(accessToken: string): Promise<any> {

    const response = await fetch(profileURL, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if(!response.ok) {
        return {};
    }
    return await response.json();
}

async function getPlaying(accessToken: string): Promise<any> {

    try {
        const response = await fetch(playerURL, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        if(!response.ok || response.status === 204) {
            return {};
        }
        return await response.json();
        
    } catch (error) {
        return {};
    }
    
}