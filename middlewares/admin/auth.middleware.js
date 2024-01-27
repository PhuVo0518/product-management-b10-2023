const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (request, response, next) => {
  if (!request.cookies.token) {
    response.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  try {
    const user = await Account.findOne({
      token: request.cookies.token,
      deleted: false,
      status: "active",
    }).select("-password");

    if (!user) {
      response.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
      return;
    }
    console.log(user);

    const role = await Role.findOne({
      _id: user.role_id,
      deleted: false,
    });
    console.log(role);

    response.locals.user = user;
    response.locals.role = role;

    next();
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
};
