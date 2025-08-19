const express = require("express");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.listen(4000, () => {
    console.log('its litsening on port 4000');
})