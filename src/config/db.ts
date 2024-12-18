import mongoose from "mongoose";
const primary = process.env.PRIMARY_CONN_STR;
if (!primary) {
  throw new Error("One or more connection strings are missing.");
}
export const primaryConnection = mongoose.createConnection(primary);
primaryConnection.on("connected", () => {
  console.log("PRIMARY DB connected");
});

primaryConnection.on("error", (err: any) => {
  console.error("Error connecting to PRIMARY DB:", err);
});
