const md5 = require("md5");

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const generateHelper = require("../../helpers/generate.helper");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts/
module.exports.index = async (request, response) => {
  // Find
  let find = {
    deleted: false,
  };
  // End Find

  const records = await Account.find(find);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
    });
    record.role = role;
  }

  response.render("admin/pages/accounts/index.pug", {
    pageTitle: "Account List",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (request, response) => {
  const roles = await Role.find({
    deleted: false,
  });

  response.render("admin/pages/accounts/create.pug", {
    pageTitle: "Add a new account",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (request, response) => {
  request.body.token = generateHelper.generateRandomString(30);
  request.body.password = md5(request.body.password);

  const record = new Account(request.body);
  await record.save();

  request.flash("success", "Add a new account successfully!");

  response.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};
