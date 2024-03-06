const Account = require("../../model/Account");
const User = require("../../model/User");
const { AppErr } = require("../../utils/appErr");

// Create
const createAccountCtrl = async (req, res, next) => {
  try {
    const { name, initialBalance, accountType, notes } = req.body;
    // Find the logged in user
    const userFound = await User.findById(req.user);

    if (!userFound) return next(new AppErr("User not found", 404));

    // Create the account
    const account = await Account.create({
      name,
      initialBalance,
      accountType,
      notes,
      createdBy: req.user,
    });

    // Push the account into users accounts field
    userFound.accounts.push(account._id);

    // Resave the user
    await userFound.save();

    res.json({
      status: "Success!",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

// All
const getAccountsCtrl = async (_req, res) => {
  try {
    const accounts = await Account.find().populate("transactions");

    res.json(accounts);
  } catch (error) {
    res.json(error);
  }
};

// Single
const getAccountCtrl = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;

    // Find account
    const account = await Account.findById(id).populate("transactions");

    res.json({
      status: "Success!",
      data: account,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete
const deleteAccountCtrl = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;

    // Find account and delete
    await Account.findByIdAndDelete(id);

    res.status(200).json({
      status: "Success!",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update
const updateAccountCtrl = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      status: "Success!",
      data: account,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createAccountCtrl,
  getAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
  getAccountsCtrl,
};
