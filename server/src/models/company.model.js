const CompanySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true }, // e.g. "INR", "USD"
},{timestamps:true});
