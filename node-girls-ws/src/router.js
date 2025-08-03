const handlers = require("./handler")


const router = (req, res) => {
  const url = req.url
  if (url === "/") {
    handlers.homeHandler(req, res)
  } 
  else if (url.indexOf('public') !== -1){
    handlers.general(req, res)
  }
  else if (url === "/create-post" && req.method === "POST") {
    handlers.createHandler(req, res)
  } 
  else if (url === "/posts" && req.method === "GET") {
    handlers.getPostsHandler(req, res)
  } 
  else {
    handlers.notFoundHandler(req, res)
  }
}

module.exports = router
