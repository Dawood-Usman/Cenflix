const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const homeRoute = require("./routes/homePageRoute");
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoutes");

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "/public");

app.set("view engine", "ejs");
app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
const session = require('express-session');
app.use(cookieParser());

app.use(
    session({
        secret: "CENFLIX",
        resave: false,
        saveUninitialized: true,
        cookie: { path: "/", httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/", homeRoute);

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server Listening At Port ${port}`);
})