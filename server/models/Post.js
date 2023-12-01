import mongoose from "mongoose";

/*
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
*/

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    postPicturePath: {
      type: String,
      default: "",
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    replies: {
      type: Array,
      default: [],
    },
    profilePicturePath: {
      type: String,
      default: "",
    },
    replyingTo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;