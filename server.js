
import app from "./app.js";
import dbConnection from "./confog/db.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => {
   await dbConnection()
    console.log(`Server is running on port ${PORT}`);
});