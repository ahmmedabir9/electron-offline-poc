const { Router } = require("express");
const {
  updateProfile,
  getUserProfile,
  getAllUsers,
  deleteUser,
  createUser,
} = require("../controllers/user.controller");

const router = Router();

//api: url/user/__
router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserProfile);
router.put("/:id", updateProfile);
router.post("/delete/:id", deleteUser);

module.exports = router;
