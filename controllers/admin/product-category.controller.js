const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (request, response) => {
  const records = await ProductCategory.find({
    deleted: false
  });

  response.render("admin/pages/products-category/index.pug", {
    pageTitle: "Product Category",
    records: records
  });
};

// [GET] /admin/products-category/create
module.exports.create = (request, response) => {
  response.render("admin/pages/products-category/create.pug", {
    pageTitle: "Add a new product category",
  });
};

// [POST] /admin/products-category/createPost
module.exports.createPost = async (request, response) => {
  if (request.body.position == "") {
    const countRecords = await ProductCategory.countDocuments();
    request.body.position = countRecords + 1;
  } else {
    request.body.position = parseInt(request.body.position);
  }

  const record = new ProductCategory(request.body);
  await record.save();

  request.flash("success", "Add a new product category successfully!");

  response.redirect(`/${systemConfig.prefixAdmin}/products-category`);
};
