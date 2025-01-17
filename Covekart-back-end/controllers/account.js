import Account from '../models/account_model.js';
import current_user from '../controllers/admin_login.js'
import userModel from '../models/user_Model.js';
import roleModel from '../models/role_model.js';
import ImageModel from '../models/images_model.js';
import bcrypt from "bcrypt"
import current_admin from '../controllers/admin_login.js';


export const postCreateAccount = async (req, res) => {
  try {

    
    const {
      id,
      password,
      name,
      email,
      country_code,
      phone, 
      profile_image_id,
      system_reserve,
      status,
      created_by_id,
      email_verified_at,
      created_at,
      updated_at,
      deleted_at,
      orders_count,
      role,
      permission,
      store,
      point,
      wallet,
      address,
      vendor_wallet,
      profile_image,
      payment_account,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!id || !name || !email || !Array.isArray(permission)) {
      return res.status(400).json({ success: false, message: 'Missing required fields or invalid permissions.' });
    }

    // Ensure each permission is valid
    for (const perm of permission) {
      if (!perm.id || !perm.name || !perm.guard_name) {
        return res.status(400).json({ success: false, message: 'Each permission must have id, name, and guard_name.' });
      }
    }


    const newAccount = new Account({
      id,
      password:hashedPassword,
      name,
      email,
      country_code,
      phone,
      profile_image_id,
      system_reserve,
      status,
      created_by_id,
      email_verified_at: email_verified_at ? new Date(email_verified_at) : null,
      created_at: created_at ? new Date(created_at) : new Date(),
      updated_at: updated_at ? new Date(updated_at) : new Date(),
      deleted_at: deleted_at ? new Date(deleted_at) : null,
      orders_count,
      role,
      permission,
      store,
      point,
      wallet,
      address,
      vendor_wallet,
      profile_image,
      payment_account,
    });

    const savedAccount = await newAccount.save();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: savedAccount,
    });

  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message,
    });
  }
};






export const getAccount = async (req, res) => {

  try {


    if (!current_user || current_user.length === 0) {

      return res.status(400).json({
        success: false,
        message: "No authenticated user found.",
      });
    }


    const userData = current_user[0];

    const user_id = userData.id;

    if (!user_id) {

      return res.status(400).json({
        success: false,
        message: "Invalid user data.",
      });
    }


    const adminAccount = await Account.findOne({ id: user_id }).lean();
    if (adminAccount) {

      const { permission, name, email, role, phone, country_code, profile_image } = adminAccount;
      return res.status(200).json({
        success: true,
        message: "Admin account retrieved successfully.",
        account: adminAccount,
        permission,
        phone,
        profile_image,
        country_code,
        name,
        email,
        role,
      });
    }

    const userAccount = await userModel.findOne({ id: user_id }).lean();

    if (!userAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const { name, email, role_id, phone, country_code, profile_image } = userAccount;

    const roleDetails = await roleModel.findOne({ id: role_id }).lean();
    const permission = roleDetails?.permissions || [];


    return res.status(200).json({
      success: true,
      message: "User account retrieved successfully.",
      account: userAccount,
      permission: permission,
      name,
      phone,
      profile_image,
      country_code,
      email: email,
      role: roleDetails,
    });
  } catch (error) {
    console.error("Error fetching account:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the account.",
      error: error.message,
    });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const { email, profile_image_id, phone,country_code } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    if (!profile_image_id && !phone) {
      return res.status(400).json({ success: false, message: "At least one field (profile_image_id or phone) must be provided" });
    }
    let profile_image = null;
    if (profile_image_id) {
      profile_image = await ImageModel.findOne({ id: profile_image_id }).lean();
      if (!profile_image) {
        return res.status(404).json({ success: false, message: "Profile image not found" });
      }
    }
    const updateData = {
      ...(profile_image_id && { profile_image_id }),
      ...(profile_image && { profile_image }),
      ...(phone && { phone }),
      ...(country_code && {country_code})
    };
    const admin = await Account.findOne({ email }).lean();
    if (admin) {
      const updatedAdmin = await Account.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, lean: true }
      );

      return res.status(200).json({
        success: true,
        message: "Admin profile updated successfully",
        user: updatedAdmin,
      });
    }
    const accountUser = await userModel.findOne({ email }).lean();
    if (accountUser) {
      const updatedUser = await userModel.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, lean: true }
      );

      return res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        user: updatedUser,
      });
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, message: "An error occurred while updating the profile" });
  }
};




export const updatePassword = async (req, res) => {
  try {
   
    const { current_password, password, password_confirmation } = req.body;

    if (!current_password || !password || !password_confirmation) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (password !== password_confirmation) {
      return res.status(400).send({ error: "Passwords do not match" });
    }
    const user = await userModel.findOne({ email: current_user[0].email });
    if (user) {
      const passwordMatch = bcrypt.compareSync(current_password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ error: "Invalid current password" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      await userModel.findOneAndUpdate(
        { email: user.email },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      return res.status(200).send({ message: "Password updated successfully" });
    }

    const admin = await Account.findOne({ email: current_admin[0].email });
    if (admin) {
      const passwordMatched = bcrypt.compareSync(current_password, admin.password);
      if (!passwordMatched) {
        return res.status(401).send({ error: "Invalid current password" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      await Account.findOneAndUpdate(
        { email: admin.email },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      return res.status(200).send({ message: "Password updated successfully" });
    }

  
    return res.status(404).send({ error: "User not found" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({ error: "Server error" });
  }
};
