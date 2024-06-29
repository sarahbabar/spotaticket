import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from "$env/static/public";
import { CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { setOAuthData, type OAuthData } from "$lib/oauth";

const tokenURL: string = "https://accounts.spotify.com/api/token";

function generate_random_uuid() {
    let ts = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (ts + Math.random()*16)%16 | 0;
        ts = Math.floor(ts/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
}

const scope: string = "user-top-read user-read-private user-read-email user-read-currently-playing";

const authUrl: string = 
    `https://accounts.spotify.com/authorize?` +
    `client_id=${PUBLIC_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${PUBLIC_REDIRECT_URI}` +
    `&scope=${scope}`;

export async function GET({ url, cookies }) {

    const code = url.searchParams.get("code");
    console.log(code);
    
    if (code) {
        const token = await getToken(code);

        const uid = generate_random_uuid();

        cookies.delete("session", { path: "/" });
        cookies.set("session", uid, { path: "/" });

        const result = await setOAuthData({
            id: uid,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            token_type: token.token_type,
            expires_in: token.expires_in
        });

        if (!result) {
            throw redirect(302, authUrl);
        }
        console.log("Access Token:", token);
        throw redirect(302, "/tickets");

    }
    throw redirect(302, authUrl);
}

async function getToken(code: string): Promise<any> {

    const response = await fetch(tokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(PUBLIC_CLIENT_ID + ':' + CLIENT_SECRET)}`
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: PUBLIC_REDIRECT_URI,
            grant_type: "authorization_code"
        })
    }).then(r => r.json());

    return response;
}

async function getRefreshToken(refreshToken: string): Promise<any> {

    const response = await fetch(tokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: PUBLIC_CLIENT_ID
        })
    }).then(r => r.json());

    return response;

}