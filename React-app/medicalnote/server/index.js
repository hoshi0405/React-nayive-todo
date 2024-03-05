const express = require('express');
const mongoose = require('mongoose');
const { json } = require('express');
const cors = require("cors")
const app = express();
const PORT = 3001;
require("dotenv").config();

// 忘れがち
app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000",
}))
app.use("/api/v1", require("./src/v1/routes"));
mongoose.set('strictQuery', false);

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("DBと接続中");
} catch (error){
  console.log(error);
}



app.listen(PORT, () => {
  console.log("server");
});
