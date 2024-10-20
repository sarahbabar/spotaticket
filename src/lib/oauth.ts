import { ADMIN_KEY, CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

const tokenURL: string = 'https://accounts.spotify.com/api/token';

export type OAuthData = {
	id: string;
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	time_stamp: number;
};

export async function setOAuthData(oauthdata: OAuthData): Promise<boolean> {
	// console.log("setOauthData called");
	try {
		const response = await fetch(`http://localhost:3000/oauth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				token: ADMIN_KEY
			},
			body: JSON.stringify(oauthdata)
		});

		if (!response.ok) {
			console.log('error in setOauthData', response.status);
			return false;
		}
	} catch (error) {
		console.log('something went wrong in setOauthData', error);
		return false;
	}
	return true;
}

export async function getTableTokens(uuid: string): Promise<OAuthData | undefined> {
	try {
		const response = await fetch(`http://localhost:3000/oauth/${uuid}`, {
			headers: { token: ADMIN_KEY }
		});

		if (!response.ok) {
			console.log('something went wrong in get table token', response.status);
			return;
		}

		try {
			const oauthData: OAuthData = await response.json();
			return oauthData;
		} catch (error) {
			console.log('table token no work :(((');
		}
	} catch (error) {
		console.log('error in get table token', error);
	}
}

export async function checkToken(
	uuid: string,
	accessToken: string,
	refreshToken: string,
	expiry: number,
	timeStamp: number
): Promise<string> {
	// current time in sec
	const currentTime = Date.now() / 1000;

	// if the current time is greater than the lifespan of the access token, use refresh token to grab a new one
	if (currentTime >= timeStamp + expiry - 300) {
		const tokenInfo = await getRefreshToken(refreshToken);

		if (tokenInfo === undefined) {
			// console.log("something went wrong in check token");
			try {
				const response = await fetch(`http://localhost:3000/oauth/${uuid}`, {
					method: 'DELETE',
					headers: { token: ADMIN_KEY }
				});
				if (!response.ok) {
					console.log('bad response - deleting');
				}
			} catch (error) {
				console.log('error in deleting', error);
			}

			throw redirect(302, '/');
		}
		// set the updated oauth/token info for the uuid in the db
		// console.log(tokenInfo);
		const result = await setOAuthData({
			id: uuid,
			access_token: tokenInfo.access_token,
			refresh_token: tokenInfo.refresh_token || refreshToken,
			token_type: tokenInfo.token_type,
			expires_in: tokenInfo.expires_in,
			time_stamp: Date.now() / 1000
		});
		if (!result) {
			throw redirect(302, '/');
		}
		// send the new access token
		// console.log("returning new access token: ", tokenInfo.access_token);
		return tokenInfo.access_token;
	}
	// send the current valid access token
	// console.log("returning old access token: ", accessToken);
	return accessToken;
}

async function getRefreshToken(refreshToken: string): Promise<any> {
	const response = await fetch(tokenURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + btoa(PUBLIC_CLIENT_ID + ':' + CLIENT_SECRET)
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: PUBLIC_CLIENT_ID
		})
	});

	if (!response.ok) {
		console.log('something went wrong in refresh token');
		return undefined;
	}
	return await response.json();
}
