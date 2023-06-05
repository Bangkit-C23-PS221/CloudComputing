const express = require("express");
const {
  registUsers,
  loginUsers,
  updateUsers
} = require("../controllers/users.js");
const {
  getMyFarm,
  getFarmDetails,
  getAllFarms,
  createFarms,
  updateFarms,
  deleteFarms,
  loginFarms
} = require("../controllers/farms.js");
const {
  getAllBookmarks,
  addBookmarks,
  deleteBookmarks,
  checkBookmarkStatus
} = require("../controllers/bookmarks.js");

const { verifyTokenForUsers } = require("../middleware/verifyTokenForUsers.js");

const router = express.Router();

// Endpoints for User
router.post("/regist-users", registUsers);
router.post("/login-users", loginUsers);
router.put("/update-users/:id_user", verifyTokenForUsers, updateUsers);

// Endpoints for Farms
router.get("/farms/:id_user", verifyTokenForUsers, getMyFarm);
router.get("/detail-farms/:id_farm", verifyTokenForUsers, getFarmDetails);
router.get("/farms", verifyTokenForUsers, getAllFarms);
router.post("/farms/:id_user/createFarms", verifyTokenForUsers, createFarms);
router.post("/login-farms/:id_user", verifyTokenForUsers, loginFarms);
router.put("/updateFarms/:id_user", verifyTokenForUsers, updateFarms);
router.delete("/deleteFarms/:id_user/:id_farm", verifyTokenForUsers, deleteFarms);

// Endpoints for bookmark
router.get("/bookmarks/:id_user", verifyTokenForUsers, getAllBookmarks);
router.post("/bookmarks/:id_user/:id_farm", verifyTokenForUsers, addBookmarks);
router.delete("/delete-bookmarks/:id_user/:id_farm", verifyTokenForUsers, deleteBookmarks);
router.post("/check-bookmarks/:id_user/:id_farm", verifyTokenForUsers, checkBookmarkStatus);

module.exports = router;
