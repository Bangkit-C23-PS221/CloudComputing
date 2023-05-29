import express from "express";
import { 
    getUsers,  
    RegistUsers,  
    LoginUsers,  
    LogoutUsers, 
    UpdateUsers 
} from "../controllers/users.js";

import { 
    getFarms,
    createFarms, 
    UpdateFarms,
    deleteFarms,
    LoginFarms
} from "../controllers/farms.js";

import { tokenRefresh } from "../controllers/refreshTokenForUsers.js";
import { verifyTokenForUsers } from "../middleware/verifyTokenForUsers.js";

const router = express.Router();

// Endpoints for User
router.get('/users', verifyTokenForUsers, getUsers);
router.post('/regist-users', RegistUsers);
router.post('/login-users', LoginUsers);
router.put('/update-users/:id_user', UpdateUsers);
router.get('/token-users', tokenRefresh);
router.delete('/logout-users', LogoutUsers);

// Endpoints for Farms
router.get('/farms', getFarms);
router.post('/users/:id_user/createFarms', createFarms);
router.post('/login-farms/:id_user', LoginFarms);
router.put('/farms/:id_user/updateFarms/:id_farm', UpdateFarms);
router.delete('/farms/:id_user/deleteFarms/:id_farm', deleteFarms);

export default router;
