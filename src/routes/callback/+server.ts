import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from "$env/static/public";
import { CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

const tokenURL: string = "https://accounts.spotify.com/api/token";

export async function GET({ url, cookies }) {

    const code = url.searchParams.get("code");

    if (code) {
        const token = await getToken(code);

        cookies.delete("accessToken", { path: "/" });
        cookies.delete("refreshToken", { path: "/" });

        cookies.set("accessToken", token.access_token, { path: "/" });
        cookies.set("refreshToken", token.refresh_token, { path: "/" });

        console.log("Access Token:", token);
        throw redirect(302, "/tickets");

    }
    const scope: string = "user-top-read user-read-private user-read-email user-read-currently-playing";

    const authUrl: string = 
        `https://accounts.spotify.com/authorize?` +
        `client_id=${PUBLIC_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${PUBLIC_REDIRECT_URI}` +
        `&scope=${scope}`;

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