import { TICKETMASTER_API_KEY } from '$env/static/private';
import { Namespace } from '$lib/namespace';
import { error, redirect } from '@sveltejs/kit';


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

        const artistNames: string[] = [];
        for (let i = 0; i < artistData.items.length; i++) {
            const encodedName = encodeURIComponent(artistData.items[i].name);
            artistNames.push(encodedName);
        }

        const events = [];
        for (const artistName of artistNames) {
            
            const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${artistName}&apikey=${TICKETMASTER_API_KEY}`);

            if(!response.ok) {
                events.push({});
            }
            const eventData = await response.json();
            events.push(eventData);
        }

        console.log(artistData);
        console.log(profileData);
        console.log(playerData);
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

async function getTopArtists(accessToken: string): Promise<any> {

    const response = await fetch(artistURL, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if(!response.ok) {
        return {};
    }
    return response.json();
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
    return response.json();
}

async function getPlaying(accessToken: string): Promise<any> {

    const response = await fetch(playerURL, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if(!response.ok) {
        return {};
    }
    return response.json();
}


