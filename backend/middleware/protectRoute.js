// // import jwt from 'jsonwebtoken'
// // import User from '../models/user.model.js'

// // const protectRoute = async (req, res, next) => {
// //     try {
// //         const token = req.cookies.jwt
// //         if (!token) {
// //             return res.status(401).json({error: 'Unauthorized - No Token provided'})
// //         }
// //         const decoded = jwt.verify(token, process.env.SECRET_KEY)
// //         if(!decoded){
// //             return res.status(401).json({error: 'Unauthorized - Invalid Token'})

// //         }

// //         const user = await User.findById(decoded.id).select('-password')

// //         if(!user){
// //             return res.status(401).json({error: 'Unauthorized - User not found'})
// //         }

// //         req.user =user

// //         next()
// //     } catch (error) { 
// //         console.log('Error in protectRoute middleware :', error.message)
// //         res.status(500).json({error: 'Internal Serval Error'})
        
// //     }
// // }

// // export default protectRoute

// // import jwt from 'jsonwebtoken';
// // import User from '../models/user.model.js';

// // const protectRoute = async (req, res, next) => {
// //     try {
// //         // Check if JWT exists in the cookies
// //         const token = req.cookies.jwt;
// //         if (!token) {
// //             return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
// //         }

// //         // Verify the token
// //         const decoded = jwt.verify(token, process.env.SECRET_KEY);

// //         // Fetch the user by decoded token ID and exclude the password field
// //         const user = await User.findById(decoded.id).select('-password');

// //         // If no user is found, return unauthorized error
// //         if (!user) {
// //             return res.status(401).json({ error: 'Unauthorized - User Not Found' });
// //         }

// //         // Attach the user to the request object
// //         req.user = user;

// //         // Proceed to the next middleware or route handler
// //         next();
// //     } catch (error) {
// //         // Handle invalid token or other errors
// //         if (error.name === 'JsonWebTokenError') {
// //             return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
// //         }

// //         console.log('Error in protectRoute middleware:', error.message);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // };

// // export default protectRoute;
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';

// const protectRoute = async (req, res, next) => {
//     try {
//         // Check if JWT exists in the cookies
//         const token = req.cookies.jwt;
//         if (!token) {
//             return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
//         }

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         if (!decoded || !decoded.id) {
//             return res.status(401).json({ error: 'Unauthorized - Invalid Token Structure' });
//         }

//         // Fetch the user by decoded token ID and exclude the password field
//         const user = await User.findById(decoded.id).select('-password');

//         // If no user is found, return unauthorized error
//         if (!user) {
//             return res.status(401).json({ error: 'Unauthorized - User Not Found' });
//         }

//         // Attach the user to the request object
//         req.user = user;

//         // Optionally log successful authentication
//         console.log(`User authenticated: ${user._id}`);

//         // Proceed to the next middleware or route handler
//         next();
//     } catch (error) {
//         // Handle specific JWT errors
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
//         } else if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ error: 'Unauthorized - Token Expired' });
//         }

//         console.log('Error in protectRoute middleware:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export default protectRoute;

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;