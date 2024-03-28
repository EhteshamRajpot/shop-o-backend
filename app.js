const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use("/", express.static("uploads"));
app.use("/", (req, res) => {
    res.send("Hello World")
})
app.use(bodyParser.urlencoded({ extended: true }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    })
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const order = require("./controller/order");
const event = require("./controller/event");
const payment = require("./controller/payment");
const product = require("./controller/product");
const message = require("./controller/messages");
const coupoun = require("./controller/coupounCode");
const conversation = require("./controller/conversation");

app.use("/api/v2/shop", shop);
app.use("/api/v2/user", user);
app.use("/api/v2/order", order);
app.use("/api/v2/event", event);
app.use("/api/v2/product", product);
app.use("/api/v2/coupoun", coupoun);
app.use("/api/v2/message", message);
app.use("/api/v2/payment", payment);
app.use("/api/v2/conversation", conversation);

// it's for ErrorHandling 
app.use(ErrorHandler);
module.exports = app;   