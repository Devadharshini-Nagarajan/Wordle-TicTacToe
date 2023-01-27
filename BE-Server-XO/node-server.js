var createError = require("http-errors");
const cors = require('cors');
const bodyParser = require('body-parser');
var express = require("express");
var indexRouter = require("./routes/index");


var app = express();
const port = 3000;

app.listen(port, () => {
    console.log("Server running on port 3000");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", indexRouter);


// 404 catch & frwrd to error handler
app.use(function(req,res, next) {
    console.log(req)
    next(createError(404));
})

// error handler
app.use(function(err,req,res,next) {

    res.status(err.status || 500);
    res.json({
        // message: err.message,
        error: err
    });
})

module.exports = app;