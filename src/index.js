const express = require("express");
const app = express();

const port = 12345;
const router = require("./routes");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log('listening on port ' + port);
});
