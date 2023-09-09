require ('dotenv').config()

const clientId = process.env.ClientID;
const params = new URLSearchParams(window.location.search)
const code = params.get("code")

if(!code){
    redirectToAuthCodeFlow(clientId)
}else{
    const accessToken = await getAccessToken(clientId, code)
    const profile = await getProfile(accessToken)
    console.log(profile)
    populateUI(profile)
}

async function redirectToAuthCodeFlow(clientId) { 
    const verifier = generateCodeVerifier(128)//similar to paswword stuff with simple Crypt
    const challenge = await generateCodeChallenge(verifier)//similar to paswword stuff with simple Crypt

    localStorage.setItem("verifier", verifier)

    const params = new URLSearchParams();
    params.append("clientId", clientId)
    params.append("response_Type", "code")
    params.append("redirect_uri", "http://loacalhost:5173/callback")
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
    const verifier = localStorage.getItem("verifier")

    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("grant_type", "authorization_code")
    params.append("code", code)
    params.append("redirect_uri", "http://localhost:5173/callback")
    params.append("code_verifier", verifier)

    const result = await fetch("https://accounts.spotify.com/api/token",{
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: params
    })

    const { access_token } = await result.json()
    return access_token
}

async function getProfile(token) { 
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });

    return await result.json()
}

async function populateUI(profile) { 

}