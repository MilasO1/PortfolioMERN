import { connect } from "mongoose";

const connectDb = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Error with connecting to MongoDB", error)
    }
}

export default connectDb