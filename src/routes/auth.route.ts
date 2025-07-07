import { driverSignUp,signUp, signIn, signOut, editUserData  } from '../controllers/auth.controller';
import { Router } from 'express';

const router = Router();

// Driver registration
router.post('/signup-driver',  driverSignUp);

// Student/parent registration
router.post('/signup', signUp);

// Login
router.post('/signin', signIn);

router.patch('/edit-user', editUserData);

// Logout
router.post('/signout', signOut);

export default router;