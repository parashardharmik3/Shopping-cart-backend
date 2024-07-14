import { Category } from "../models/categoryModel.js";

export const categoryController = {
    getCategories:async(req,res)=>{
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    },
    createCategory:async(req,res)=> {
        try {
            const {name} = req.body;
            const category = await Category.findOne({name})
            if(category){
                return res.status(400).json({msg:"category already exists"})
            }
            const newCategory = new Category({name});
            await newCategory.save();
            res.json({msg:'check admin seccess'});
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    deleteCategory:async(req,res)=> {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.json({msg:"deleted successfully"}) 
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },
    updateCategory:async(req,res)=> {
        try {
            const { name } = req.body;
            await Category.findByIdAndUpdate(req.params.id, { name });
            res.json({msg:"updated successfully"})
        } catch (error) {
            res.status(500).json({msh:error.message})
        }
    }
}