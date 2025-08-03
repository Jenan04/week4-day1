const fs = require("fs")
const path = require("path")
const querystring = require ('querystring')

const general = (req, res) =>{
    let endpoint = req.url;
    const extension = endpoint.split(".")[1];
    let extensiontype ={
        css: "text/css",
        js: "application/javascript",
        png: "image/png",
        ico:"image/x-icon"
    }
    const filepath = path.join(__dirname, "..", endpoint);
    fs.readFile(filepath, (err, file) => {
    if (err) {
      console.log(err);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(
        "<h1>404 Not Found</h1><p>The requested file does not exist.</p>"
      );
    } else {
      res.writeHead(200, { "Content-Type": extensiontype[extension] });
      res.end(file);
    }
  });

}
const homeHandler = (req, res) =>{
  const filePath = path.join(__dirname, "..", "public", "index.html")
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500)
      res.end("Server error")
    } else {
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    }
  })
}

const createHandler = (req, res) => {

 let allData ='';
  req.on("data" ,(Data) =>{
     allData+=Data
  })

  req.on('end', ()=>{
    let cameData = querystring.parse(allData);
    let timestamp = Date.now();
    let content = cameData ["post"]|| ''
    console.log(cameData)
    const filepath = path.join(__dirname, 'posts.json')
    fs.readFile(filepath, (err, data) => {
                if (err) {
                    console.error('Error reading posts.json:', err);
                    return
                }

                let posts={}
                posts=JSON.parse(data)||{}
                posts[timestamp]=content
                fs.writeFile(filepath,JSON.stringify(posts),(err)=>{
                    if(err){
                    console.error('Error writing posts.json:', err);
                    res.writeHead(500);
                    return res.end('Internal Server Error')
                    }
                    res.writeHead(302, {location: '/'});
                    res.end()
                })
            });
        })
  }


const getPostsHandler = (req, res) => {
  const postsPath = path.join(__dirname, "posts.json")

    fs.readFile(postsPath, (err, data) => {
        if (err) {
          console.error('Error reading posts.json:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
  });
    
}
const notFoundHandler = (req, res) =>{
  res.writeHead(404)
  res.end("404 Not Found")
}


module.exports = { homeHandler, createHandler, getPostsHandler, notFoundHandler, general }
