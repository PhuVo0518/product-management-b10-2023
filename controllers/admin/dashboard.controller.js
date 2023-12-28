// [GET] /
module.exports.index = (request, response) => {
    response.render("admin/pages/dashboard/index.pug", {
        pageTitle: "Admin Dashboard",
    });
};
