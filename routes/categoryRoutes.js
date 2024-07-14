import express from "express";
import { categoryController } from "../controllers/categoryController.js";
import { auth } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
export const categoryRoutes = express.Router();
categoryRoutes.get('/category',categoryController.getCategories);
categoryRoutes.post('/category',auth,authAdmin,categoryController.createCategory);
categoryRoutes.delete('/category/:id',auth,authAdmin,categoryController.deleteCategory)
categoryRoutes.put('/category/:id',auth,authAdmin,categoryController.updateCategory)
// categoryRoutes.post()