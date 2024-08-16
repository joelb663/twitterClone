import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 6,
            max: 20,
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 20,
        },
        userId: {
            type: String,
            unique: true,
            required: false,
        },
    },
    { timestamps: true }
);

const UserAccount = mongoose.model("UserAccount", UserAccountSchema);
export default UserAccount;