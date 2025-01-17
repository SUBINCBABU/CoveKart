import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Account from "../models/account_model.js";
import userModel from "../models/user_Model.js";

const { verify, sign } = jwt;


export function adminVerified(req, res, next) {
    const adminHeader = req.headers.authorization;
    if (!adminHeader) {
        return res.status(400).send({ error: "Authorization header is missing" });
    }

    const adminToken = adminHeader.split(" ")[1];
    if (!adminToken) {
        return res.status(400).send({ error: "Token is missing" });
    }

    verify(adminToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: "Token is invalid or expired" });
        }
        req.admin = decoded;
        next();
    });
}

// let current_admin = [];
// export const postAdminLogin = async (req, res) => {
//     try {

//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).send({ error: "Email and password are required" });
//         }
//         const user = await Account.findOne({ email });
//         if (!user) {

//             const bkUser = await userModel.findOne({ email });
//             const passwordMatch = bcrypt.compareSync(password, bkUser.password);
//             if (!passwordMatch) {

//                 return res.status(401).send({ error: "Invalid email or password" });
//             }
//             const userResp = { email: bkUser.email, name: bkUser.name };
//             const secretKey = process.env.JWT_SECRET;
//             const userToken = jwt.sign(userResp, secretKey, { expiresIn: 120 });
//             const data = {
//                 token: userToken,
//                 access_token: userToken,
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//             };
    
//             if (Array.isArray(current_admin)) {
//                 current_admin.push(data);
//             }
    
    
//             return res.status(200).send(data);

//         }

//         const passwordMatch = bcrypt.compareSync(password, user.password);
//         if (!passwordMatch) {

//             return res.status(401).send({ error: "Invalid email or password" });
//         }
//         const userResp = { email: user.email, name: user.name };
//         const secretKey = process.env.JWT_SECRET;
//         const userToken = jwt.sign(userResp, secretKey, { expiresIn: 120 });

//         const data = {
//             token: userToken,
//             access_token: userToken,
//             id: user.id,
//             name: user.name,
//             email: user.email,
//         };

//         if (Array.isArray(current_admin)) {
//             current_admin.push(data);
//         }


//         return res.status(200).send(data);

//     } catch (err) {
//         console.error("Error during login:", err);
//         return res.status(500).send({ error: "Server error during login" });
//     }
// };



let current_admin = [];

export const postAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }
    let user = await Account.findOne({ email });

    if (!user) {
    
      const bkUser = await userModel.findOne({ email });

      if (!bkUser) {
        return res.status(401).send({ error: "Invalid email or password" });
      }

      const passwordMatch = bcrypt.compareSync(password, bkUser.password);
      if (!passwordMatch) {
        return res.status(401).send({ error: "Invalid email or password" });
      }
      const userResp = { email: bkUser.email, name: bkUser.name };
      const secretKey = process.env.JWT_SECRET;
      const userToken = jwt.sign(userResp, secretKey, { expiresIn: '2h' });

      const data = {
        token: userToken,
        access_token: userToken,
        id: bkUser.id,
        name: bkUser.name,
        email: bkUser.email,
      };

      if (Array.isArray(current_admin)) {
        current_admin.push(data);
      }

      return res.status(200).send(data);
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    const userResp = { email: user.email, name: user.name };
    const secretKey = process.env.JWT_SECRET;
    const userToken = jwt.sign(userResp, secretKey, { expiresIn: '2h' });

    const data = {
      token: userToken,
      access_token: userToken,
      id: user.id,
      name: user.name,
      email: user.email,
    };

    if (Array.isArray(current_admin)) {
      current_admin.push(data);
    }

    return res.status(200).send(data);

  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send({ error: "Server error during login" });
  }
};





export const postAdminLogout = async (req, res) => {
    try {

        const data = req.body;
        if (data) {

            current_admin.length = 0

            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }

        res.status(400).json({
            success: false,
            message: "Invalid request data for logout.",
        });

    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while logging out.",
            error: error.message,
        });
    }
};





export default current_admin