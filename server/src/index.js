import app from "./app.js"
import connectDB from "./db/dbConnection.js"

import AWS from "aws-sdk";

const textract = new AWS.Textract({
  region: process.env.AWS_REGION,
});






const PORT =process.env.PORT 

if (!PORT || isNaN(Number(PORT))) {
  throw new Error("PORT environment variable is not set or is invalid. This is required on Render.");
}


const startServer = async () => {
  try {
    textract.getDocumentAnalysis({ Document: { Bytes: Buffer.from("") } }, (err, data) => {
      if (err) console.log("AWS Credentials / SDK issue:", err);
      else console.log("AWS works!");
    });
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