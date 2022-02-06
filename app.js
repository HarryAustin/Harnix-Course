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

// SET up connect mongo
const sessionStore = mongoStore.create({
  mongoUrl: process.env.MONGO_URI,
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
app.use("/media", express.static(path.resolve(__dirname, "media")));
// END

// Routes
app.use("/auth/v1", authRoute);
app.use("/blog/v1", userIsLoggedIn, articleRoute);
app.use("/user/v1", userIsLoggedIn, userRoute);

app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/article", (req, res) => {
  res.render("article", { layout: false });
});

app.get("/registration", (req, res) => {
  res.render("registration", { layout: false });
});

app.get("/login", (req, res) => {
  console.log(req.body);
  res.render("login", { layout: false });
});

const PORT = process.env.PORT || 3000;
connectDB(() => {
  app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`);
  });
});
