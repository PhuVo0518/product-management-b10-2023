const Product = require("../../models/product.model");
const filterStateHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const system = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (request, response) => {
  try {
    // Feature: Filter by State
    const filterState = filterStateHelper(request.query);
    // End Feature: Filter by State

    const find = {
      deleted: false,
    };

    if (request.query.status) {
      find.status = request.query.status;
    }

    // Feature: Search
    if (request.query.keyword) {
      const regex = new RegExp(request.query.keyword, "i");
      find.title = regex;
    }
    // End Feature: Search

    // Feature: Pagination
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(4, request.query, countProducts);

    // End Feature: Pagination

    // Sort
    const sort = {};
    if (request.query.sortKey && request.query.sortValue) {
      sort[request.query.sortKey] = request.query.sortValue;
    } else {
      sort["position"] = "desc";
    }
    // End Sort

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    // response.render("admin/pages/products/index.pug", {
    //     pageTitle: "Product List",
    //     products: products,
    //     filterState: filterState,
    //     keyword: request.query.keyword,
    //     pagination: objectPagination,
    // });

    // Check error
    if (products.length > 0 || countProducts == 0) {
      response.render("admin/pages/products/index.pug", {
        pageTitle: "Product List",
        products: products,
        filterState: filterState,
        keyword: request.query.keyword,
        pagination: objectPagination,
      });
    } else {
      let stringQuery = "";

      for (const key in request.query) {
        if (key != "page") {
          stringQuery += `&${key}=${request.query[key]}`;
        }
      }

      const href = `${request.baseUrl}?page=1${stringQuery}`;

      response.redirect(href);
    }
  } catch (error) {
    console.log(error);
    response.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (request, response) => {
  const status = request.params.status;
  const id = request.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  request.flash("success", "Update status successfully!");

  response.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (request, response) => {
  // console.log(request.body);
  const type = request.body.type;
  const ids = request.body.ids.split(", ");

  switch (type) {
    case "active":
    case "inactive":
      await Product.updateMany(
        {
          _id: { $in: ids },
        },
        {
          status: type,
        }
      );

      request.flash("success", "Update status successfully!");
      break;
    case "delete-all":
      await Product.updateMany(
        {
          _id: { $in: ids },
        },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );

      request.flash("success", "Delete product(s) successfully!");
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          {
            _id: id,
          },
          {
            position: position,
          }
        );
      }

      request.flash("success", "Change position(s) successfully!");
      break;
    default:
      break;
  }

  response.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (request, response) => {
  try {
    const id = request.params.id;
    // delete permanently
    // await Product.deleteOne({ _id: id });

    // soft deletion
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    request.flash("success", "Delete product(s) successfully!");
  } catch (error) {
    console.log(error);
  }

  response.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (request, response) => {
  response.render("admin/pages/products/create.pug", {
    pageTitle: "Add a new product",
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (request, response) => {
  request.body.price = parseInt(request.body.price);
  request.body.discountPercentage = parseInt(request.body.discountPercentage);
  request.body.stock = parseInt(request.body.stock);

  if (request.body.position == "") {
    const countProducts = await Product.countDocuments();
    request.body.position = countProducts + 1;
  } else {
    request.body.position = parseInt(request.body.position);
  }

  // console.log(request.file);
  // console.log(request.body);

  //   if (request.file && request.file.filename) {
  //     request.body.thumbnail = `/uploads/${request.file.filename}`;
  //   }

  const product = new Product(request.body);
  await product.save();

  request.flash("success", "Add a new product successfully!");

  response.redirect(`/${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (request, response) => {
  try {
    const id = request.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });

    response.render("admin/pages/products/edit.pug", {
      pageTitle: "Edit the product",
      product: product,
    });
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (request, response) => {
  try {
    const id = request.params.id;
    // console.log(id);
    // console.log(request.body);

    // response.send("OK");

    request.body.price = parseInt(request.body.price);
    request.body.discountPercentage = parseInt(request.body.discountPercentage);
    request.body.stock = parseInt(request.body.stock);

    request.body.position = parseInt(request.body.position);

    // console.log(request.file);

    if (request.file && request.file.filename) {
      request.body.thumbnail = `/uploads/${request.file.filename}`;
    }

    await Product.updateOne(
      {
        _id: id,
        deleted: false,
      },
      request.body
    );

    request.flash("success", "Edit the product successfully!");

    response.redirect("back");
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (request, response) => {
  try {
    const id = request.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });

    response.render("admin/pages/products/detail.pug", {
      pageTitle: "Product Detail",
      product: product,
    });
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};
