const express = require("express");
const database = require("./config/config");

require("./models/userModel");
require("./models/contributionsModel");
require("./models/loansModels");
require("./models/loanRepaymentsModel");
require("./models/settingsModel");
require("./models/auditLogsModel");
require("./models/NotificationsModel");




const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());


async function initializeDatabase() {
    try {
        await  database.authenticate();
        console.log("you're connected to the database");

        // synch all the models
        await database.sync();
        console.log("All tables synchronized successfully");

    } catch (error) {
        console.log("connection Error :", error);
    }
}


// Initialize database before starting server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});