const express = require("express");
const globalErrHandler = require("./middlewares/globalErrHandler");
require("./config/dbConnect");
const accountRoute = require("./routes/accounts/accountRoute");
const transactionsRoute = require("./routes/transactions/transactionsRoute");
const usersRoute = require("./routes/users/usersRoute");

const app = express();

// Middlewares

app.use(express.json()); // Parse incoming data

// Users route
app.use("/api/v1/users", usersRoute);

// Account routes
app.use("/api/v1/accounts", accountRoute);

// Transactions route
app.use("/api/v1/transactions", transactionsRoute);

// Error handlers
app.use(globalErrHandler);

// Listen to server
const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server is up and runing on port ${PORT}`));
