import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const signup = async (req,res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body

        if(password !== confirmPassword){
            return res.status(400).json({msg: 'Passwords do not match'})
        }
        const user = await User.findOne({username})

        if(user){
            return res.status(400).json({msg: 'User already exists'})
        }

        //Hash Password Here

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender == 'male' ? boyProfilePic : girlProfilePic
        }) 

       if(newUser){
        //Generate JWT token here
        
        await newUser.save()
        generateTokenAndSetCookie(newUser._id, res)

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        })
       }else{
        res.status(400).json({msg: 'Failed to create user'})
       }
    } catch (error) {
        console.log('Error in signUp controller', error)
        res.status(500).json({msg: 'Error creating user'})
        
    }
}

// export const login = async (req,res)=>{
//     try {
//         const {username, password} = req.body
//         const user = await User.findOne({username})
//         const isPasswordCorrect = bcrypt.compare(password, user?.password || "")

//         if(!user || isPasswordCorrect){
//             return res.status(400).json({error: "Invalid Username or password"})
//         }

//         generateTokenAndSetCookie(user._id, res)

//         res.status(200).json({
//             _id: user._id,
//             fullName: user.fullName,
//             username: user.username,
//             profilePic: user.profilePic,

//         })
        
//     } catch (error) {
//         console.log('Error in login controller', error)
//         res.status(500).json({msg: 'Error creating user'}) 
//     }

// }
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        
        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Return user details (excluding password)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log('Error in login controller:', error);
        res.status(500).json({ msg: 'Error logging in user' });
    }
};

// export const logout = async (req,res) =>{
//     try {
//         res.cookie('jwt',"", {maxAge:0})
//         res.status(500).json({error: 'Internal Server Error'})
//     } catch (error) {
//         console.log('Error in logout controller:', error);
//         res.status(500).json({ msg: 'Internal Server Error' }); 
//     }
// }

export const logout = async (req, res) => {
    try {
        // Clear the JWT token by setting the cookie to an empty string and a very short expiration time
        res.cookie('jwt', "", { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            maxAge: 0 // immediately expire the cookie
        });

        // Return a success message
        res.status(200).json({ msg: 'Logout successful' });

    } catch (error) {
        console.log('Error in logout controller:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};
 