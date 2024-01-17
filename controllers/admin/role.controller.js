// [GET] /admin/roles/

module.exports.index = (request, response) => {
  response.render("admin/pages/roles/index.pug", {
    pageTitle: "Roles",
  });
};
