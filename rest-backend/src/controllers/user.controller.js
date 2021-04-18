const { User } = require("../models/User.models");

//create user
const createUser = async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(406).json({ message: "Could not create user" });
  }

  try {
    const user = await User.create({
      name: name,
      email: email,
      phone: phone,
      address: address,
    });

    if (!user) {
      return res.status(406).json({ message: "Could not create user" });
    }

    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//get user profile
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(406).json({ message: "no user ID" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "Could not find user" });
    }

    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec();

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "NO user Available" });
    }
    return res.status(200).json({
      users: users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete an user
const deleteUser = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(404).json({ message: "No User Id" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//update user profile
const updateProfile = async (req, res) => {
  const { id } = req.params;
  let profile = {};
  const { name, email, phone, address } = req.body;
  if (name) {
    profile.name = name;
  }
  if (email) {
    profile.email = email;
  }
  if (phone) {
    profile.phone = phone;
  }
  if (address) {
    profile.address = address;
  }

  try {
    const newProfile = await User.findByIdAndUpdate(id, profile).exec();
    if (newProfile) {
      return res.status(200).json({ updated: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getUserProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
};
