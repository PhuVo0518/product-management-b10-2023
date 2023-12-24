const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.render("client/pages/products/index.pug");
});

// router.get("/detail", (request, response) => {
//     response.send("Product Detail");
// });

// router.get("/edit", (request, response) => {
//     response.send("Product Edit");
// });

// router.get("/create", (request, response) => {
//     response.render("client/pages/products/index.pug");
// });

module.exports = router;
