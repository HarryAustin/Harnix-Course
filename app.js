require("dotenv").config({ path: "./config.env" });
const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const mongoStore = require("connect-mongo").default;
// const passport = require("passport");
const passport = require("./server/services/passport");
// MY LIBRARIES
const connectDB = require("./server/database/database");
const authRoute = require("./server/routes/auth.route");
const articleRoute = require("./server/routes/article.route");
const userRoute = require("./server/routes/user.route");
const { userIsLoggedIn } = require("./server/middlewares/authLogin.middleware");

// const FroalaEditor = require("./node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js");
// const fs = require("fs");

// SET up connect mongo
const sessionStore = mongoStore.create({
  mongoUrl: process.env.MONGO_URI_PROD,
  collectionName: "session",
});

const app = express();

// Form for req.body middleware
app.use(express.urlencoded({ extended: true }));

// Session Authentication
app.use(
  session({
    secret: "key",
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// End authentication

// VIEW ENGINE
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    helpers: {
      trimList: (list) => {
        let string = (() => {
          let finished = "";
          for (let i = 0; i < list.length; i++) {
            finished += `#${list[i]} `;
          }
          return finished;
        })();
        return string;
      },
      dateFormat: (date) => {
        return date.toLocaleDateString();
      },
    },
  })
);
// END

// ASSETS SETUP
app.use("/assets", express.static(path.resolve(__dirname, "assets")));
// END

//Media uploads
// app.use("/media", express.static(path.resolve(__dirname, "media")));
// Only for development since i'll be using cloudinary instead
// END

// Routes
app.use("/auth/v1", authRoute);
app.use("/blog/v1", userIsLoggedIn, articleRoute);
app.use("/user/v1", userIsLoggedIn, userRoute);

app.get("/", (req, res) => {
  res.render("redirect", { layout: false });
});

// END

app.use((req, res, next) => {
  res.send(
    "This is a 404 error, normally you will need some client to show this on a frontend, from love Harnix tech!"
  );
});

app.use((err, req, res, next) => {
  res.send("Why is there an error showing nah!!... Me im tired o... LOL!");
});

const PORT = process.env.PORT || 3000;
connectDB(() => {
  app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`);
  });
});
