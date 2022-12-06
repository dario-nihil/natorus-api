import express from 'express';

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController';

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
