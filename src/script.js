require ('dotenv').config()

const clientId = process.env.ClientID;
const code = undefined;

if(!code){
    redirectToAuthCodeFlow(clientId)
}else{
    const accessToken = await getAccessToken(clientId, code)
    const profile = await getProfile(accessToken)
    populateUI(profile)
}

async function redirectToAuthCodeFlow(clientId) { 
    const verifier = generateCodeVerifier(128)
    const challenge = await generateCodeChallenge(verifier)

    localStorage.setItem("verifier", verifier)

    const params = new URLSearchParams();
    params.append("clientId", clientId)
    params.append("response_Type", "code")
    params.append("redirect_uri", "http://loacalhost:3000/callback")
    params.append("scope", "user-read-private user-read-email")//list of permissions were requesting from the user
    params.append("code_challenge_method", "S256")
    params.append("code_challenge", challenge)

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

function generateCodeVerifier(length){

    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for(let i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

async function generateCodeChallenge(codeVerifier){
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\-/g, '_')
        .replace(/=+$/,'')
}


async function getAccessToken(clientId, code) { 

}

async function getProfile(token) { 

}

async function populateUI(profile) { 

}