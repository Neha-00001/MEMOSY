// import mongoose from "mongoose";
// import dns from "dns";

// dns.setServers(["8.8.8.8", "8.8.4.4"]);


//  export const connectDB=async()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URL);
// console.log("MONGODB connected Successfully");
//         }
//         catch(error){
//             console.error("Error connecting to MongoDB",error);
//             process.exit(1);

//         }
//     };












import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MONGODB connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};
