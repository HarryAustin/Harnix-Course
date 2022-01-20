require("dotenv").config({ path: "./config.env" });
const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");

const app = express();

// Json Middlware
app.use(express.json());

// VIEW ENGINE
app.set("view engine", "hbs");
app.engine("hbs", hbs({ extname: "hbs" }));
// END

// ASSETS SETUP
app.use("/assets", express.static(path.resolve(__dirname, "assets")));
// END

//Media uploads
app.use("/media", express.static(path.resolve(__dirname, "media")));
// END

app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/article", (req, res) => {
  res.render("article", { layout: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
