import mongoose from "mongoose";
const Schema = mongoose.Schema;

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const paymentSchema = new Schema(
  {
    receiptid: {
      type: String,
      required: true
    },
    teamid: {
      type: String,
      required: false,  
    },
    tournamentid: {
      type: String,
      required: false,  
    },
    payerid: {
      type: String,
      required: false,
    },
    payertype: {
      type: String,
      enum: ["competitor", "spectator"],
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: false,
      default: "pending",
    },
  },
  { timestamps: true }
);

// payments is the name of the collection in DB
// paymentSchema is the name of the Schema
const paymentDB = mongoose.model("payments", paymentSchema);
export default paymentDB;
