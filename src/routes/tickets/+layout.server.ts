import { NAMESPACE_KEY, TICKETMASTER_API_KEY } from '$env/static/private';
import { Namespace } from '$lib/namespace';
import { checkToken, getTableTokens } from '$lib/oauth';
import { error, redirect } from '@sveltejs/kit';

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

    try {
        const [longTermArtists, mediumTermArtists, profileData, playerData] = await Promise.all([
            getTopArtists(access_token, "long_term"),
            getTopArtists(access_token, "medium_term"),
            getProfile(access_token),
            getPlaying(access_token)
        ]);
        
        return {
            longTermArtists: longTermArtists.items,
            mediumTermArtists: mediumTermArtists.items,
            profile: profileData,
            player: playerData
        };
    }
    catch(error) {
        console.log("womp womp", error);
        throw error;
    }
}

async function getTopArtists(accessToken: string, timeRange: string): Promise<any> {

    const artistURL = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=12&offset=0`;

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


