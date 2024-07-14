import express from "express";
import { productController } from "../controllers/productController.js";
export const productRoutes = express.Router();
productRoutes.get('/products',productController.getProducts)
productRoutes.post('/products',productController.createProducts)
productRoutes.delete('/products/:id',productController.deleteProducts)
productRoutes.put('/products/:id',productController.updateProducts)