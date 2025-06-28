async function getClientToken() {
    const keycloakUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.REALM}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.append('client_id', process.env.CLIENT_ID);
    body.append('client_secret', process.env.CLIENT_SECRET);
    body.append('grant_type', 'client_credentials');

    const response = await fetch(keycloakUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} ${await response.text()}`);
    }

    const json = await response.json();
    const token = json.access_token;
    console.log(`Retrieved token ${token}`)
    return token
}

async function getUsers() {
    const token = await getClientToken();

    const response = await fetch(`${process.env.KEYCLOAK_URL}/admin/realms/${process.env.REALM}/users?briefRepresentation=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} ${await response.text()}`);
    }

    return response.json();
}

module.exports = getUsers;