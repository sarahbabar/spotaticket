import { NAMESPACE_KEY, TICKETMASTER_API_KEY } from '$env/static/private';
import { Namespace } from '$lib/namespace';
import { checkToken, getTableTokens } from '$lib/oauth';
import { error, redirect } from '@sveltejs/kit';

const artistURL = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0`;
const profileURL = `https://api.spotify.com/v1/me`;
const playerURL = `https://api.spotify.com/v1/me/player/currently-playing`;

export async function load({ cookies }) {

    const uuid = cookies.get("session")

    // if no uid exists go back and login
    if (!uuid) throw redirect(302, "/");
    
    const oauthdata = await getTableTokens(uuid);

    if (!oauthdata) throw redirect(302, "/");

    const expires_in = oauthdata.expires_in;
    const time_stamp = oauthdata.time_stamp;

    // have access token, need to check if useable (not expired)
    const access_token = await checkToken(uuid, oauthdata.access_token, oauthdata.refresh_token, expires_in, time_stamp);

    // if(!access_token) {
    //     // no access token, not logged in -> sent back home
    //     throw redirect(302, "/");
    // }
    // otherwise
    try {
        const [artistData, profileData, playerData] = await Promise.all([
            getTopArtists(access_token),
            getProfile(access_token),
            getPlaying(access_token)
        ]);

        //console.log(artistData);
        //console.log(profileData);
        //console.log(playerData);

        const artistNames: string[] = [];
        for (let i = 0; i < (artistData.items || []).length; i++) {
            const encodedName = encodeURIComponent(artistData.items[i].name);
            artistNames.push(encodedName);
        }

        // const events = [];
        // for (const artistName of artistNames) {
            
        //     const eventData = await getEvent(artistName);
        //     events.push(eventData);
        // }
        
        console.log(artistNames);
        // console.log(events);
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

// async function getEvent(artistName: string) {

//     const eventStore = "ticketMaster".concat(artistName);
//     const cachedEvent = await get(eventStore);
//     const timeDifference = Date.now() - cachedEvent.timeStamp;
    
//     // if there exists cached data in the store and it is less than an hr old make use of it
//     if(cachedEvent !== null && timeDifference < (1000 * 60 * 60)) {
//         console.log("using cached", eventStore);
//         const minimalResp = {
//             events: cachedEvent._embedded ? cachedEvent._embedded.events : [],
//             timeStamp: cachedEvent.timeStamp
//         };
//         return minimalResp;
//     }
//     // otherwise fetch the data from ticketmaster
//     const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=200&keyword=${artistName}&apikey=${TICKETMASTER_API_KEY}`);
//     console.log("fetched");

//     if(response.status === 429) {
//         return {};
//     }
//     if(!response.ok) {
//         const obj = {
//             events: [],
//             timeStamp: Date.now()
//         };
//         await set(eventStore, obj);
//         return {};
//     }
//     const resp = await response.json();
//     resp.timeStamp = Date.now();
//     const minimalResp:{ events: any[]; timeStamp: number }[] = [];

//     // minimize the response data to only include the events and timestamp
//     for(let i = 0; i < resp.length; i++) {
//         const item = resp[i];
//         const events = item._embedded ? item._embedded.events : []; // if _embedded doesn't exist in the response, set events to an empty array
//         const timeStamp = item.timeStamp;
//         minimalResp.push({events, timeStamp});
//     }
//     // set the data fetched with the corresponding artist name for the store
//     await set(eventStore, minimalResp);
//     return minimalResp;
// }

