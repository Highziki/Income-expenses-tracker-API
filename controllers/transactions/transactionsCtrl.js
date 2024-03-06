const Account = require("../../model/Account");
const Transaction = require("../../model/Transaction");
const User = require("../../model/User");
const { AppErr } = require("../../utils/appErr");

// Create
const createTransactionCtrl = async (req, res, next) => {
  try {
    const { name, amount, notes, transactionType, account, category } =
      req.body;

    // Find user
    const userFound = await User.findById(req.user);

    if (!userFound) return next(new AppErr("User not found", 404));

    // Find the account
    const accountFound = await Account.findById(account);

    if (!accountFound) return next(new AppErr("Account not found", 404));

    // Create the transaction
    const transaction = await Transaction.create({
      amount,
      notes,
      account,
      transactionType,
      category,
      name,
      createdBy: req.user,
    });

    // Push the transaction to the account
    accountFound.transactions.push(transaction._id);

    // Resave the account
    await accountFound.save();

    res.json({ status: "succes", data: transaction });
  } catch (error) {
    res.json(error);
  }
};

// All
const getTransactionsCtrl = async (_req, res, next) => {
  try {
    // Find account
    const transaction = await Transaction.find();

    res.status(200).json({
      status: "Success!",
      data: transaction,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Single
const getTransactionCtrl = async (req, res) => {
  try {
    // Get id from params
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    res.json({ status: "Success!", data: transaction });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete
const deleteTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find account and delete
    await Transaction.findByIdAndDelete(id);
    res.json({
      status: "Success!",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update
const updateTransactionCtrl = async (req, res, next) => {
  try {
    // Get id from params
    const { id } = req.params;

    const transaction = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      status: "Success!",
      data: transaction,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createTransactionCtrl,
  getTransactionsCtrl,
  getTransactionsCtrl,
  getTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};
