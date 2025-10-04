import mongoose from "mongoose";
const { Schema, model } = mongoose;



const CompanySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true }, // e.g. "INR", "USD"
},{timestamps:true});

const Company = model("Company", CompanySchema);
export default Company;
