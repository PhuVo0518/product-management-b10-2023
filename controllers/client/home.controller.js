// [GET] /
module.exports.index = (request, response) => {
    response.render("client/pages/home/index.pug", { pageTitle: "Homepage" });
};
