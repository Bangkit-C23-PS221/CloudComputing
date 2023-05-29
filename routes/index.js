import express from "express";
import { 
    getUsers,  
    RegistUser,  
    LoginUser,  
    LogoutUser, 
    UpdateUser 
} from "../controllers/users.js";

import { 
    getFarms,
    createFarms, 
    UpdateFarms,
    deleteFarms
} from "../controllers/farms.js";

import { tokenRefresh } from "../controllers/refreshTokenForUsers.js";
import { verifyTokenForUsers } from "../middleware/verifyTokenForUsers.js";

const router = express.Router();

// Endpoints for User
router.get('/users', verifyTokenForUsers, getUsers);
router.post('/regist-users', RegistUser);
router.post('/login-users', LoginUser);
router.put('/update-users/:id_user', UpdateUser);
router.get('/token-users', tokenRefresh);
router.delete('/logout-users', LogoutUser);

// Endpoints for Farms
router.get('/farms', getFarms);
router.post('/users/:id_user/createFarms', createFarms);
router.put('/users/:id_user/updateFarms/:id_farm', UpdateFarms);
router.delete('/users/:id_user/deleteFarms/:id_farm', deleteFarms);

export default router;