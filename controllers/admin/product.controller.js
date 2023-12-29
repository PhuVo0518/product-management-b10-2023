// [GET] /admin/products
module.exports.index = (request, response) => {
    response.render("admin/pages/products/index.pug", {
        pageTitle: "Product List",
    });
};
