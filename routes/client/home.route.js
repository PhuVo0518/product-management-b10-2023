const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.render("client/pages/home/index.pug");
});

module.exports = router;
