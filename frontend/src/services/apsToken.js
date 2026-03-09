export async function getAccessToken(callback) {
    const response = await fetch("/api/token");
    const data = await response.json();

    callback(data.access_token, data.expires_in);
}