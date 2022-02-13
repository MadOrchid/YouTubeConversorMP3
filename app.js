// requered packages 
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// creat the express server 
const app = express();

// server port number

const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// needed to parse html data for POST request
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoId;
    if (
        videoId === undefined ||
        videoId === "" ||
        videoId === null
    ) {
        return res.render("index", { success: false, message : "Please enter a video ID" });
     } else {
         
         const fetchAPI = await fetch (`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
             "method" : "GET",
             "headers": {
                 "x-rapidapi-key": process.env.API_KEY,
                 "x-rapidapi-host": process.env.API_HOST
             }
             
         });
         const fetchResponse = await fetchAPI.json();
         console.log(fetchResponse);

         if(fetchResponse.status === "ok")
             return res.render("index",  {success: true, song_title: fetchResponse.
        title, song_link : fetchResponse.link});
        else 
             return res.render("index", {success: false, message:fetchResponse.msg })
     }
}) 

// start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

/* app.post('/convert-mp3', (req, res) => {
    const {videoId} = req.body;
  
    const installOptions = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: {id: videoId},
      headers: {
        'x-rapidapi-host': process.env.API_HOST,
        'x-rapidapi-key': process.env.API_KEY,
         "x-rapidapi-ua" : 'RapidAPI-Playground'
      }
    }
    
    axios.request(installOptions).then((response) => {
          
  
        if(!response.data.link){
          res.render('index', {success: true, videoId});
        }else {
          res.redirect(response.data.link)
        }
  
  
      }).catch((error) => {
          
          console.error(error)
      });
      console.log(videoId)
  })
   */