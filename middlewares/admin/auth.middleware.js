const Account = require("../../models/account.model");
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
    });

    if (!user) {
      response.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
      return;
    }

    next();
  } catch (error) {
    response.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
};
