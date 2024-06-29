export type OAuthData = {
    id: string,
    access_token: string,
    refresh_token: string,
    token_type: string,
    expires_in: number
};

export async function setOAuthData(oauthdata: OAuthData): Promise<boolean> {
    console.log("setOauthData called");
    try {
        const response = await fetch(`http://localhost:3000/oauth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(oauthdata)
        });

        if(!response.ok) {
            console.log("error in setOauthData", response.status);
            return false;
        }
    } catch (error) {
        console.log("something went wrong in setOauthData", error);
        return false;
    }
    return true;
}

export async function getTableTokens(uid: string): Promise<OAuthData | undefined> {
    try {
        const response = await fetch(`http://localhost:3000/oauth/${uid}`);

        if(!response.ok) {
            console.log("something went wrong in get table token", response.status);
            return
        }
        const oauthData: OAuthData = await response.json();
        return oauthData;
    } catch (error) {
        console.log("error in get table token", error);
    }
}