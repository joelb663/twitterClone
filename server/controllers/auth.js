import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserAccount from "../models/UserAccount.js";
import UserProfile from "../models/UserProfile.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
          } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* Custom register UserAccount and UserProfile */
export const register2 = async (req, res) => {
    try {
        const  {
            username,
            password,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUserAccount = new UserAccount({
            username,
            password: passwordHash,
        });
        const savedUserAccount = await newUserAccount.save();
        //res.status(201).json(savedUserAccount);

        if (!savedUserAccount) return res.status(400).json({ msg: "Register User failed" });

        const  {
            name,
            gender,
            birthDate,
        } = req.body;

        const newUserProfile = new UserProfile({
            name,
            gender,
            birthDate,
        });

        const savedUserProfile = await newUserProfile.save();
        res.status(201).json(savedUserProfile);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

/* custom login user */
export const login2 = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userAccount = await UserAccount.findOne({ username: username });
        if (!userAccount) return res.status(400).json({ msg: "User Account does not exist. " });

        const isMatch = await bcrypt.compare(password, userAccount.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
        const token = jwt.sign({ id: userAccount._id }, process.env.JWT_SECRET);
        delete userAccount.password;
        res.status(200).json({ token, userAccount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};