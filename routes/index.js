import express from "express";
import {  
    registUsers,  
    loginUsers,  
    updateUsers 
} from "../controllers/users.js";

import { 
    getAllFarms,
    createFarms, 
    updateFarms,
    deleteFarms,
    loginFarms
} from "../controllers/farms.js";

import { 
    getAllBookmarks,
    addBookmarks,
    getFarmDetails,
    deleteBookmarks, 
    checkBookmarkStatus
} from "../controllers/bookmarks.js";

import { verifyTokenForUsers } from "../middleware/verifyTokenForUsers.js";

const router = express.Router();

// Endpoints for User
router.post('/regist-users', registUsers);
router.post('/login-users', loginUsers);
router.put('/update-users/:id_user', verifyTokenForUsers, updateUsers);

// Endpoints for Farms
router.get('/farms', verifyTokenForUsers, getAllFarms);
router.post('/farms/:id_user/createFarms', verifyTokenForUsers, createFarms);
router.post('/login-farms/:id_user', verifyTokenForUsers, loginFarms);
router.put('/updateFarms/:id_farm', verifyTokenForUsers, updateFarms);
router.delete('/deleteFarms/:id_user/:id_farm', verifyTokenForUsers, deleteFarms);

// Endpoints for bookmark
router.get('/bookmarks/:id_user', verifyTokenForUsers, getAllBookmarks);
router.post('/bookmarks/:id_user/:id_farm', verifyTokenForUsers, addBookmarks);
router.get('/detail-bookmarks/:id_farm', verifyTokenForUsers, getFarmDetails);
router.delete('/delete-bookmarks/:id_bookmark', verifyTokenForUsers, deleteBookmarks);
router.post('/check-bookmarks/:id_user/:id_farm', verifyTokenForUsers, checkBookmarkStatus);


export default router;
