import 'dotenv/config';
import mongoose from 'mongoose';
const url = "mongodb+srv://adminuser:T5FKstKyAAxvONQ6@applyflowcluster.plevbhn.mongodb.net/?appName=ApplyFlowCluster";
console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('CONNECTED SUCCESSFULLY'); process.exit(0); })
  .catch(err => { console.error('CONNECTION FAILED:', err.message); process.exit(1); });