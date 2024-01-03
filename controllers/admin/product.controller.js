const Product = require("../../models/product.model");
const filterStateHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");

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
        const objectPagination = paginationHelper(
            4,
            request.query,
            countProducts
        );

        // End Feature: Pagination

        const products = await Product.find(find)
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
            break;

        default:
            break;
    }

    response.redirect("back");
};
