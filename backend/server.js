const app = require("./app");
const connectDb = require("./config/db");

connectDb();

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})