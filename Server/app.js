const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRouter = require("./routers/adminRoute");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRouter);


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});