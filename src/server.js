require('dotenv').config();
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";

let app = express();

viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

initWebRoutes(app);

let port = process.env.port || 8080;
let MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
app.listen(port, ()=>{
  console.log("go");
  console.log(MY_VERIFY_TOKEN);
});
