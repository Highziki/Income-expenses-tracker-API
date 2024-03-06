const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const { AppErr, appErr } = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");

// Register
const registerUserCtrl = async (req, res, next) => {
  try {
    const { fullname, password, email } = req.body;

    // Check if email exist
    const userFound = await User.findOne({ email });

    if (userFound) {
      return next(appErr("User already exists", 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.json({
      status: "Success!",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Login
const userLoginCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) return next(new AppErr("Invalid login credentials", 400));

    // Check for password validity
    const isPasswordMatch = await bcrypt.compare(password, userFound.password);

    if (!isPasswordMatch)
      return next(new AppErr("Invalid login credentials", 400));

    res.json({
      status: "Success!",
      fullname: userFound.fullname,
      id: userFound._id,
      token: generateToken(userFound._id),
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Profile
const userProfileCtrl = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate({
      path: "accounts",
      populate: {
        path: "transactions",
        model: "Transaction",
      },
    });

    res.json(user);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete
const deleteUserCtrl = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user);

    res.status(200).json({
      status: "Success!",
      data: null,
    });

    res.json({ msg: "delete route" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update
const updateUserCtrl = async (req, res, next) => {
  try {
    // Check if email exist
    if (req.body.email) {
      const userFound = await User.findOne({ email: req.body.email });
      if (userFound)
        return next(
          new AppErr("Email is taken or you already have this email", 400)
        );
    }

    // Check if user is updating the password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Update the user
      const user = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // Send the response
      return res.status(200).json({
        status: "Success!",
        data: user,
      });
    }

    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });

    // Send the response
    res.status(200).json({
      status: "Success!",
      data: user,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  registerUserCtrl,
  userLoginCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};
