import mongoose from 'mongoose';
const connectDB = async () => {
   try {
mongoose.connect(process.env.MONGO_URI)
   }catch{

   }
}