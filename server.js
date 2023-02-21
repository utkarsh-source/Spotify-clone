const express = require('express');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const uniqid = require('uniqid');
const app = express();

const PORT = process.env.PORT || 5000;

let client_id = "9949dfb316be48d1a9af31cb23fddf37";
let client_secret = "a823e08c14f84c838806355acd9c5833";
let redirect_uri = "https://spotify-clone-ivory-nine.vercel.app/";
let scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
]
      

app
  .use(express.static(path.join(__dirname, '/build')))
  .use(cors())
  .use(cookieParser())
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
  
app.get('/login', function (req, res) {
  const state = uniqid();
  res.cookie("state", state);
  const scopeString = scope.join(" ");
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scopeString,
      redirect_uri: redirect_uri,
      state: state,
    }));
});


app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null; 
  let storedState = req.cookies ? req.cookies["state"] : null

  if (state == null || state != storedState) {
    res.redirect("/#" +
      querystring.stringify({ error: "state_mismatch" })
    )
  } else {
    res.clearCookie("state")

    const authOption = {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + (Buffer.from(client_id + ":" + client_secret).toString("base64"))
      },
      body: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
      json : true
    }

    fetch("https://accounts.spotify.com/api/token", authOption).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          let access_token = data.access_token
          let refresh_token = data.refresh_token
          res.redirect("#"+querystring.stringify({ access_token, refresh_token})) 
        })
      } else {
          res.redirect("#"+querystring.stringify({ error : "invalid_token"})) 
        
      }
    })
  }
})


app.get("/refresh_token", function (req, res) {
  const refreshToken = req.query.refresh_token
  const authOption = {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + (Buffer.from(client_id + ":" + client_secret).toString("base64"))
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    }

     fetch("https://accounts.spotify.com/api/token", authOption).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          let access_token = data.access_token
          res.send({ access_token })
        })
      }
    }).catch(error => {
      console.error(error)
      res.send(error)
    })
}) 