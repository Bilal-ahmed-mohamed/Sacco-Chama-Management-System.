require('dotenv').config();
const express = require("express");
const database = require("./config/config");
const userRoutes = require("./routes/users");
const contributionsRoutes = require("./routes/contributions");
const loanRoutes = require("./routes/loans");
require("./models/userModel");
require("./models/contributionsModel");
require("./models/loansModels");
require("./models/loanRepaymentsModel");
require("./models/settingsModel");
require("./models/auditLogsModel");
require("./models/NotificationsModel");
const cron = require("node-cron");
const {sendLoanReminders} = require("./controllers/loanReminderController");
const mpesaRoutes =  require("./routes/mpesa");



const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/contributions', contributionsRoutes);
app.use('/api/loans' , loanRoutes);
app.use("/api/mpesa", mpesaRoutes);


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


// middleware
app.use((req,res,next) => {
    console.log(req.path, req.method);

    next();
})


// Run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running loan reminder job...");
  sendLoanReminders();
});

// Initialize database before starting server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});