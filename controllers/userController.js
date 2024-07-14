import { Users } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if the user already exists
            const user = await Users.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "Email already exists" });
            }

            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({ msg: "Password too short" });
            }

            // Hashing password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new Users({ name, email, password: passwordHash });
            await newUser.save();

            // Create JWT to authenticate
            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            // Respond with success message
            res.status(201).json({ accessToken });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ msg: "Please login or register" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register" });

                const accessToken = createAccessToken({ id: user.id });
                res.json({ user,accessToken });
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    login:async(req,res)=> {
        try {
            const {email,password} = req.body;
            const user = await Users.findOne({email});
            if(!user){
                res.status(400).json({msg:"This email is not registered"})
            }
            const isMatch = bcrypt.compare(password,user.password);
            if(!isMatch){
                res.status(500).json({msg:"Wrong Password"})
            }
            const accessToken = createAccessToken({id:user._id})
            const refreshToken = createRefreshToken({id:user._id})
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                path:'/user/refresh_token'
            })
            res.status(200).json({msg:"Login Successful",accessToken})
        } catch (error) {
            res.status(500).json({msg:"This email is not registered"})
            }
    },
    logout:async(req,res)=>{
        try {
            res.clearCookie('refreshToken',{path:'user/refresh_token'});
            return res.json({msg:"logged out"})
        } catch (error) {
            res.status(400).json({msg:"something went wrong"});
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ msg: "User Not Found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
