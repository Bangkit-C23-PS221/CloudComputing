import express from "express";
import {  
    RegistUsers,  
    LoginUsers,  
    UpdateUsers 
} from "../controllers/users.js";

import { 
    getAllFarms,
    createFarms, 
    UpdateFarms,
    deleteFarms,
    LoginFarms
} from "../controllers/farms.js";

import { 
    getAllBookmarks,
    addBookmarks,
    getFarmDetails,
    deleteBookmarks
} from "../controllers/bookmarks.js";

import { verifyTokenForUsers } from "../middleware/verifyTokenForUsers.js";

const router = express.Router();

// Endpoints for User
router.post('/regist-users', RegistUsers);
router.post('/login-users', LoginUsers);
router.put('/update-users/:id_user', verifyTokenForUsers, UpdateUsers);

// Endpoints for Farms
router.get('/farms', verifyTokenForUsers, getAllFarms);
router.post('/farms/:id_user/createFarms', verifyTokenForUsers, createFarms);
router.post('/login-farms/:id_user', verifyTokenForUsers, LoginFarms);
router.put('/farms/updateFarms/:id_farm', verifyTokenForUsers, UpdateFarms);
router.delete('/farms/:id_user/deleteFarms/:id_farm', verifyTokenForUsers, deleteFarms);

// Endpoints for bookmark
router.get('/bookmarks/:id_user', verifyTokenForUsers, getAllBookmarks);
router.post('/bookmarks/:id_user/:id_farm', verifyTokenForUsers, addBookmarks);
router.get('/detail-bookmarks/:id_farm', verifyTokenForUsers, getFarmDetails);
router.delete('/delete-bookmarks/:id_bookmark', verifyTokenForUsers, deleteBookmarks);

export default router;
