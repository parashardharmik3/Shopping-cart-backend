import { Product } from "../models/productModel.js";
class APIfeatuers{
    query;
    queryString;
    constructor(query,queryString){
        this.query = query;
        this.queryString=queryString;
    }
    filtering(){
        const queryObj = {...this.queryString};
        console.log(queryObj);
        const excludedFeilds = ['page','sort','limit'];
        excludedFeilds.forEach(el=>delete(queryObj[el]));
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match => '$' + match);
        this.query.find(JSON.parse(queryStr));
        return this
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
export const productController={
    getProducts:async(req,res)=> {
        try {
            console.log(req.query)
            const features = new APIfeatuers(Product.find(),req.query).filtering().sorting().pagination()
            const products = await features.query;
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    createProducts:async(req,res)=> {
        try {
            const {product_id,title,price,description,images,content,category} = req.body;
            if(!images){
                return res.status(400).json({msg:"No image uploaded"});
            }
            const product = await Product.findOne({product_id});
            if(product){
                return res.status(400).json({msg:"Product already exists"});
            }
            const newProduct = new Product({product_id,title:title.toLowerCase(),price,description,images,content,category});
            newProduct.save();
            return res.status(200).json({msg:"createdSuccess"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    deleteProducts:async(req,res)=> {
        try {
            const id = req.params.id;
            await Product.findByIdAndDelete(id);
            return res.status(200).json({msg:"deleted successfully"});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    updateProducts: async (req, res) => {
        try {
            const { title, price, description, images, content, category } = req.body;
            
            if (!images) {
                return res.status(400).json({ msg: "No image was uploaded" });
            }
    
            await Product.findByIdAndUpdate(
                { _id: req.params.id },
                { 
                    title: title.toLowerCase(),
                    price,
                    description,
                    images,
                    content,
                    category 
                }
            );
    
            return res.status(200).json({ msg: "Updated successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}