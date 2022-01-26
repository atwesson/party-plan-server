require("dotenv").config();

const Express = require("express");
const app = Express();
const dbConnection = require("./db");

const controllers = require("./controllers");

app.use(Express.json());
app.use(require('./middlewares/headers'));

app.use("/user", controllers.userController);

app.use(require('./middlewares/validate-session'));
app.use("/parties", controllers.partiesController);
app.use("/items", controllers.itemsController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server] listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(`[Server] crashed. Error = ${err}`)
    });
