import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            max: 50,
        },
        gender: {
            type: String,
            enum: ["male", "female"]
        },
        birthDate: {
            type: String,
        },
        bio: {
            type: String,
            max: 160,
        },
        dateJoined: {
            type: Date,
        },
        profilePicturePath: {
            type: String,
        },
        followers: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        },
        posts: {
            type: Array,
            default: [],
        },
        replies: {
            type: Array,
            default: [],
        },
        likes: {
            type: Array,
            default: [],
        },
        location: {
            type: String,
        },
    },
    { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;