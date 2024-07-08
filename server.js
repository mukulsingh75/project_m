import express from "express";
import https from "https";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import fs from "fs";
import cors from "cors";

import userRoute from "./routes/userRoute.js";
dotenv.config();

const app = express();

const port_no = process.env.SERVER_PORT;

app.use(express.json());
app.use(cors()); 

async function dbConnection() {
  await connectDb();
}

dbConnection();

app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.json({ success: "true", message: "Server is running" });
});

const sslOptions = {
  key: fs.readFileSync("ssl_certificates/privatekey.pem"),
  cert: fs.readFileSync("ssl_certificates/__ourappdemo_com.crt"),
  ca: fs.readFileSync("ssl_certificates/__ourappdemo_com.ca-bundle"),
};

var httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(port_no, () => {
  console.log(`Server is running on port: ${port_no} and url is https://localhost:4000`);
});
