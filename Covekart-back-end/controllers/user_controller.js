import userModel from "../models/user_Model.js";
import jwt from "jsonwebtoken"
import twilio from "twilio"
import userAddressModel from "../models/userAddress_Model.js";
import bcrypt from "bcrypt"
import attributeModel from "../models/attribute_model.js";
import stateModel from "../models/state_model.js";
import countryModel from "../models/country.model.js";
import roleModel from "../models/role_model.js";
import dotenv from "dotenv";

dotenv.config()

// Manually define __dirname for ES modules

const { verify, sign } = jwt;
const TWILIO_ACCOUNT = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN
const From = process.env.from
const client = twilio(TWILIO_ACCOUNT, TWILIO_AUTH);


const generateNumericId = async () => {
    const MINid = 10000;
    const MAXid = Number.MAX_SAFE_INTEGER;

    try {
        // Find the last tag and increment the ID
        const lastTag = await userModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let newId = lastTag ? lastTag.id + 1 : MINid;

        // Reset to MINid if we've reached MAXid
        if (newId > MAXid) {
            newId = MINid;
        }

        // Ensure the new ID is unique
        const existingIdTag = await userModel.findOne({ id: newId });
        if (existingIdTag) {
            // Recursively generate a new ID if collision occurs
            return generateNumericId();
        }

        return newId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};



let user_for_update
let users
export let current_user = [];
let expiresAt, sendOTP


export const postSignup = async (req, res) => {


    const { name, email, password, phone, country_code, } = req.body;
    const existingUser = await userModel.findOne({ phone });
    if (existingUser) {

        return res.status(400).json({ msg: "User already exists" });
    }
    const existingUser_email = await userModel.findOne({ email });
    if (existingUser_email) {

        return res.status(400).json({ msg: "User already exists" });
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique ID for the new user
        const numericId = await generateNumericId();
        const role = await roleModel.findOne({ name: "consumer" })



        users = new userModel({
            id: numericId,
            role: role,
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            country_code: country_code,

        });

        let expiryTimeInMinutes = 1;
        expiresAt = new Date().getTime() + expiryTimeInMinutes * 60 * 1000;
        const sendOTP = generateOTP(phone);
        user_for_update = users
        return res.status(200).json({ msg: "OTP sent successfully", email });
    }
};

// Generate OTP and send via Twilio
function generateOTP(to, length = 5) {
    sendOTP = '';
    const characters = '0123456789';

    // Generate OTP code
    for (let i = 0; i < length; i++) {
        sendOTP += characters[Math.floor(Math.random() * characters.length)];
    }

    // Send OTP via Twilio
    // client.messages
    //     .create({
    //         body: `Your OTP code is ${sendOTP}`,
    //         from: From, // Your Twilio number
    //         to
    //     })
    //     .then(message => {
    //         console.log(`Message sent with SID: ${message.sid}`);
    //     })
    //     .catch(error => {
    //         console.error(`Error: ${error.message}`);
    //     });

    console.log("your otp :", sendOTP);

    return sendOTP;
}

// ---Correct

let inputOtp;
export const postSignupVerify = async (req, res) => {
    try {
        inputOtp = req.body.token

        if (!inputOtp) {

            return res.status(400).json({ status: "error", msg: "Please enter OTP." });
        }


        const validationResult = validateOTP(inputOtp, sendOTP, expiresAt);
        if (!validationResult.success) {
            return res.status(validationResult.statusCode).json({ msg: validationResult.msg });
        }
        await users.save();
        return res.status(200).json({ status: "success", msg: "OTP verified and user saved successfully." });
    } catch (error) {
        console.error("Error in postSignupVerify:", error.message);
        return res.status(500).json({ status: "error", msg: "Internal server error." });
    }
};


const validateOTP = (inputOtp, sendOTP, expiresAt) => {
    const currentTime = new Date().getTime();

    if (currentTime > expiresAt) {

        return { success: false, statusCode: 400, msg: "OTP expired." };
    }

    if (inputOtp !== sendOTP) {


        return { success: false, statusCode: 400, msg: "Invalid OTP." };
    }

    return { success: true };
};






let password_updating_user = [], forgot_check = false
export const postForgotPassword = async (req, res) => {
    const { email } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        password_updating_user = existingUser
        forgot_check = true
        let phone = existingUser.phone
        let expiryTimeInMinutes = 1;
        expiresAt = new Date().getTime() + expiryTimeInMinutes * 60 * 1000;
        const sendOTP = generateOTP(phone);

        return res.status(200).json({ msg: "Otp sent successfully" });
    }
    else {

        return res.status(400).json({ msg: "invalid User" });
    }

}

export const postUpdatePassword = async (req, res) => {
    const password = req.body.password


    if (password_updating_user.length !== 0) {
        const result = await userModel.updateOne(
            { email: password_updating_user.email },
            { $set: { password: password } }
        );
        return res.status(200).json({ msg: "Password Updatetd successfully" });
    }
    else {
        if (user_for_update.length !== 0) {
            const result = await userModel.updateOne(
                { email: user_for_update.email },
                { $set: { password: password } }
            );
            return res.status(200).json({ msg: "Password Updatetd successfully" });
        }






        return res.status(400).json({ msg: "enter a password" });
    }


}



let current_data

export const postLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).send({ error: "Email and password are required" });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {

            return res.status(401).send({ error: "Invalid email or password" });
        }

        // Compare passwords
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {

            return res.status(401).send({ error: "Invalid email or password" });
        }

        // Generate token
        const userResp = { email: user.email, id: user.id, name: user.name };
        const secretKey = process.env.JWT_SECRET;
        const userToken = jwt.sign(userResp, secretKey, { expiresIn: 3153600000 });

        current_data = {
            token: userToken,
            id: user.id,
            name: user.name,
            email: user.email,
        };

        if (Array.isArray(current_user)) {
            current_user.push(current_data);
        }

        return res.status(200).send(current_data);
    } catch (error) {
        return res.status(500).send({
            error: "An error occurred during login",
            message: error.message,
        });
    }
};





// middleware

let authHeader
export function verified(req, res, next) {
 
    authHeader = req.headers.authorization
    if (authHeader == undefined) {
        res.status(400).send({ error: "error token" })
    }
    else {

        let token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.send({ error: "Token expire" })
            }
            else {
                console.log("success");

                next();

            }
        })
    }

}



export const postLogout = async (req, res) => {
    try {

        const data = req.body;
        if (data) {

            current_user.length = 0

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






export const getUserDetails = async (req, res) => {
    try {
       
        const jwt = req.headers.authorization;
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
      
console.log(jwt);

        if (!decodedData.id) {
            return res.status(200).json(null); // Send null when no current_user
        }

        const userId = decodedData.id;

        // Fetch user details from the database
        const user = await userModel.findOne({ id: userId }).lean();
        if (!user) {
            return res.status(404).json({
                status: "not found",
                message: "User not found.",
            });
        }

        // Fetch user addresses if available
        if (user.address && user.address.length > 0) {
            try {
                const addresses = await userAddressModel
                    .find({ id: { $in: user.address } })
                    .lean();
                user.address = addresses || [];
            } catch (addressError) {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to fetch user addresses.",
                    error: addressError.message,
                });
            }
        }
        //else {
        // Remove the address field if it's empty or undefined
        // delete user.address;
        // }

        // Return the user details
        return res.status(200).json(user);
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            status: "error",
            message: "An error occurred while fetching user details.",
            error: error.message,
        });
    }
};




const generateNumericIdForAddress = async () => {
    const MINid = 1;
    const MAXid = Number.MAX_SAFE_INTEGER;

    try {

        const lastTag = await userAddressModel.findOne({}, { id: 1 }).sort({ id: -1 });
        let lastId = lastTag && Number.isFinite(lastTag.id) ? lastTag.id : 0;
        let addressNewId = lastId + 1;
        if (addressNewId > MAXid) {
            addressNewId = MINid;
        }
        const existingIdTag = await userAddressModel.findOne({ id: addressNewId });
        if (existingIdTag) {
            return generateNumericIdForAddress();
        }

        return addressNewId;
    } catch (error) {
        console.error(`ID generation error: ${error.message}`);
        throw new Error(`Failed to generate unique ID: ${error.message}`);
    }
};





export const postCreateUserAddress = async (req, res) => {
    try {


        const jwt = req.headers.authorization;
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
        const userid = decodedData.id


       
        
        if (!userid) {
           
            return res.status(400).json({
                status: "error",
                message: "User is not authenticated",
            });
        }
        const User = await userModel.findOne({ id: userid });
        if (!User) {
           
            return res.status(400).json({
                status: "error",
                message: "Invalid user ID",
            });
        }
       
        const addressId = await generateNumericIdForAddress();
        const country = await countryModel.findOne({ id: req.body.country_id }).lean();
        if (!country) {
           
            return res.status(400).json({
                status: "error",
                message: "Invalid country ID",
            });
        }

        const state = await stateModel.findOne({ id: req.body.state_id }).lean();
        if (!state) {
            return res.status(400).json({
                status: "error",
                message: "Invalid state ID",
            });
        }
        const address = new userAddressModel({
            id: addressId,
            title: req.body.title,
            street: req.body.street,
            stateid: req.body.stateid,
            countryid: req.body.countryid,
            city: req.body.city,
            pincode: req.body.pincode,
            country_code: req.body.country_code,
            phone: req.body.phone,
            userid: userid,
            country: country,
            state: state,
            type: req.body.type,
            is_default: req.body.is_default || false,
        });


        const result = await address.save();
        await userModel.findOneAndUpdate(
            { id: userid },
            { $push: { address: addressId } }
        );

        res.status(201).json(result);
    } catch (error) {
        console.error(`Error creating user address: ${error.message}`);
        res.status(500).json({
            status: "error",
            message: `Failed to create address: ${error.message}`,
        });
    }
};


export const updateUserAddress = async (req, res) => {
    try {
        const id = req.params.id; // Assume this is the user's unique MongoDB id
        const updateData = req.body;

        // Update the user address and return the updated document
        const result = await userAddressModel.findOneAndUpdate(
            { id: id }, // Use id for MongoDB documents
            { $set: updateData },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User address not found",
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        // Handle errors gracefully
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the user address",
            error: error.message,
        });
    }
};





export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ status: "error", message: "Unauthorized: No token provided" });
        }

        let decodedData;
        try {
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ status: "error", message: "Unauthorized: Invalid token" });
        }


        if (!decodedData?.id) {
            return res.status(400).json({ status: "error", message: "Invalid user data in token" });
        }

        const deletedAddress = await userAddressModel.findOneAndDelete(
            { id },
            {
                $set: {
                    deleted_at: new Date(),
                    status: false,
                },
            },
            { new: true } // Return the updated document
        );

        if (!deletedAddress) {
            return res.status(404).json({
                message: "Address not found",
                success: false,
            });
        }

        // Update user's address list
        const user = await userModel.findOne({ id: decodedData.id }).lean();
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }



        const updatedAddress = [];
        const address = user.address;
        const numberToRemove = id;



        for (let i = 0; i < address.length; i++) {
            if (address[i] != numberToRemove) {
                updatedAddress.push(address[i]);
            }
        }



        const updatedUser = await userModel.findOneAndUpdate(
            { id: decodedData.id },
            { $set: { address: updatedAddress } },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        try {
            const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>"
            const base64Url = token.split('.')[1];
            const decodedData = JSON.parse(Buffer.from(base64Url, 'base64').toString());

            if (!decodedData || !decodedData.id) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            if (!name) {
                return res.status(400).json({ message: 'Name is required' });
            }

            const updatedUser = await userModel.findOneAndUpdate(
                { id: decodedData.id },
                { $set: { name } },
                { new: true }
            ).lean();

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Fetch user again to include updated details
            const user = await userModel.findOne({ id: decodedData.id }).lean();

            if (user?.address?.length) {
                try {
                    const addresses = await userAddressModel
                        .find({ id: { $in: user.address } })
                        .lean();
                    user.address = addresses || [];
                } catch (addressError) {
                    console.error('Address Fetch Error:', addressError);
                    return res.status(500).json({
                        status: "error",
                        message: "Failed to fetch user addresses.",
                        error: addressError.message,
                    });
                }
            }

            return res.status(200).json(user);
        } catch (jwtError) {
            console.error('JWT Decoding Error:', jwtError);
            return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





async function attributeidGenerate() {
    function generateFiveDigitRandomNumber() {
        return Math.floor(10000 + Math.random() * 90000);
    }
    try {
        let newid;
        let isUnique = false;
        while (!isUnique) {
            newid = generateFiveDigitRandomNumber();
            const existingAttribute = await attributeModel.findOne({ id: newid });
            if (!existingAttribute) {
                isUnique = true;
            }
        }

        return newid;
    } catch (error) {
        console.error("Error generating unique ID:", error);
        throw error;
    }
}

export const postCreateAttribute = async (req, res) => {
    try {
        const data = req.body;
        
        if (!data.name || !data.status || !data.style) {
            return res.status(400).json({
                message: "Missing required fields. Please provide name, status, and style"
            });
        }
        const newid = await attributeidGenerate();

        const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');

        try {

            if (!Array.isArray(data.value)) {
                throw new Error("Attribute values must be an array");
            }

            const processedValues = data.value.reduce((validValues, value) => {

                if (!value || typeof value !== 'object') {
                    console.warn('Skipping invalid attribute value:', value);
                    return validValues;
                }

                // Validate required fields
                if (!value.value) {
                    console.warn('Skipping attribute value missing required fields:', value);
                    return validValues;
                }

                // Create validated attribute value object
                const processedValue = {
                    id: newid,
                    value: value.value.trim(),
                    slug: value.value.toLowerCase().trim(),
                    hex_color: value.hex_color ? value.hex_color.trim() : null,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null
                };

                validValues.push(processedValue);
                return validValues;
            }, []);

            if (processedValues.length === 0) {
                return res.status(400).json({
                    message: "No valid attribute values provided"
                });
            }
            const attribute = new attributeModel({
                id: newid,
                name: data.name.trim(),
                slug: slug,
                status: Number(data.status),
                style: data.style.trim(),
                created_byid: data.created_byid || null,
                attribute_values: processedValues,
                deleted_at: null
            });
            const existingSlug = await attributeModel.findOne({ slug: slug });
            if (existingSlug) {
                return res.status(400).json({
                    message: "An attribute with this slug already exists"
                });
            }
            await attribute.save();

           
            res.status(201).json({
                message: "Attribute created successfully",
                attribute
            });

        } catch (processError) {
            console.error("Error processing attribute values:", processError);
            return res.status(400).json({
                message: "Error processing attribute values",
                error: processError.message
            });
        }

    } catch (error) {
        console.error("Error creating attribute:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Duplicate key error. Please ensure slugs are unique.",
                error: error.message
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getAttribute = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;
        const query = {};
        const attributes = await attributeModel.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const total = await attributeModel.countDocuments(query);

        res.status(200).json({
            data: attributes,
            total: total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error('Error fetching attributes:', error);
        res.status(500).json({ message: 'An error occurred while fetching attributes.', error: error.message });
    }

}

export const deleteAttribute = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if id is provided
        if (!id) {
            return res.status(400).json({
                message: "Attribute ID is required"
            });
        }

        // Find the attribute first to check if it exists
        const existingAttribute = await attributeModel.findOne({ id: id });

        if (!existingAttribute) {
            return res.status(404).json({
                message: "Attribute not found"
            });
        }

        // Check if attribute is being used (you might want to add this check)
        // const isAttributeInUse = await productModel.findOne({ attributes: id });
        // if (isAttributeInUse) {
        //     return res.status(400).json({
        //         message: "Cannot delete attribute as it is being used by products"
        //     });
        // }

        // Perform soft delete by updating deleted_at field
        const deletedAttribute = await attributeModel.findOneAndDelete(
            { id: id },
            {
                deleted_at: new Date(),
                // Also soft delete all associated attribute values
                'attribute_values.$[].deleted_at': new Date()
            },
            { new: true }
        );

        if (!deletedAttribute) {
            return res.status(404).json({
                message: "Failed to delete attribute"
            });
        }

      
        res.status(200).json({
            message: "Attribute deleted successfully",
            attribute: deletedAttribute
        });

    } catch (error) {
        console.error("Error deleting attribute:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
