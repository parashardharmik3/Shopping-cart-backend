import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser"; // Import body-parser
import { routes } from "./routes/userRoutes.js"; // Adjust the path as necessary
import cookieParser from "cookie-parser";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";

configDotenv();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(bodyParser.json()); // Correctly using bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware
app.get('/', (req, res) => {
    res.send("Hello");
});

// Use the imported routes
app.use('/user', routes);
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
});

// Connect to MongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });
