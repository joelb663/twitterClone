import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserAccount from "../models/UserAccount.js";
import UserProfile from "../models/UserProfile.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const  {
            username,
            password,
        } = req.body;

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt();
        // Hash the password with the generated salt
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Create a new user account instance with the hashed password
        const newUserAccount = new UserAccount({
            username,
            password: passwordHash,
        });
        // Save the user account to the database
        const savedUserAccount = await newUserAccount.save();

        // If saving the user account fails, return a 400 status with an error message
        if (!savedUserAccount) return res.status(400).json({ msg: "Register User failed" });

        // Destructure additional fields from the request body for the user profile
        const  {
            name,
            gender,
            birthDate,
        } = req.body;

        // Create a new user profile instance
        const newUserProfile = new UserProfile({
            name,
            gender,
            birthDate,
        });
        // Save the user profile to the database
        const savedUserProfile = await newUserProfile.save();

        // Update the user account to include the new user profile's ID
        const updatedUserAccount = await UserAccount.updateOne(
            { _id: savedUserAccount._id }, // Match the user account by its ID
            { userId: savedUserProfile._id } // Set the userId to the saved user profile's ID
        );
        // Respond with the updated user account
        res.status(201).json(updatedUserAccount);

    } catch (err) {
        // If an error occurs, respond with a 500 status and the error message
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        // Destructure the username and password from the request body
        const { username, password } = req.body;
        // Find the user account by the provided username
        const userAccount = await UserAccount.findOne({ username: username });
        // If no user account is found, return a 400 status with an error message
        if (!userAccount) return res.status(400).json({ msg: "User Account does not exist." });

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, userAccount.password);
        // If the passwords do not match, return a 400 status with an error message
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
  
        // Generate a JWT token with the user account's ID as the payload
        const token = jwt.sign({ id: userAccount._id }, process.env.JWT_SECRET);
        // Remove the password field from the user account before sending it in the response
        delete userAccount.password;
        // Respond with the JWT token and the user account information
        res.status(200).json({ token, userAccount });
    } catch (err) {
        // If an error occurs, respond with a 500 status and the error message
        res.status(500).json({ error: err.message });
    }
};