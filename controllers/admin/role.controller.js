const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles/
module.exports.index = async (request, response) => {
  const records = await Role.find({
    deleted: false,
  });

  response.render("admin/pages/roles/index.pug", {
    pageTitle: "Roles",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = (request, response) => {
  response.render("admin/pages/roles/create.pug", {
    pageTitle: "Add a new role",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (request, response) => {
  const record = new Role(request.body);

  await record.save();

  request.flash("success", "Add a new role successfully!");

  response.redirect(`/${systemConfig.prefixAdmin}/roles`);
};
