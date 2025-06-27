import mongoose from 'mongoose';

const dbConnection = async()=>{
    try {
          const connection =await mongoose.connect(process.env.MONGOOSE_URI);
          if(connection) {
              console.log("Database connected successfully");
          }
    } catch (error) {
        console.log("Database connection failed", error.message);
    }
}

export default dbConnection;