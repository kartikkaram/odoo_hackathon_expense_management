import { configDotenv } from "dotenv";
import app from "./app.js"
import connectDB from "./db/dbConnection.js"

configDotenv();

const PORT =process.env.PORT || 8001

if (!PORT || isNaN(Number(PORT))) {
  throw new Error("PORT environment variable is not set or is invalid. This is required on Render.");
}


const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");
  
    app.listen(PORT, () => {
      console.log(`Server is listening at port: ${PORT}`);

    });
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1); 
  }
};

startServer();