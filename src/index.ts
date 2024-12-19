import app from "./app";
import db_connect from "./config/db";
db_connect();
const Port = process.env.PORT || 9000;
app.listen(Port, () => console.log(`Server stattingon port ${Port}`));
