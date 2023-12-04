import { Router } from "express";
import { ProductManager } from "../../manager/productManager.js"

const router = Router();

const PM = new ProductManager("./src/products.json")

router.get("/", (request, response) => {
    const { limit } = request.query;
    const products = PM.getProducts();
    if (limit) {
        const limitOptions = products.slice(0, limit);
        return response.json(limitOptions);
    }
    else {
        return response.json(products);
    }
});

router.get("/:pid", (request, response) => {
    const { pid } = request.params;
    try {
        const productFind = PM.getProductById(pid);
        return response.json(productFind);
    }
    catch (error) {
        return response.json({error: error.message})
    }
});

router.post("/", (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    if (title == null || description == null || code == null || price == null || stock == null || category == null){
        return res.status(400).json({message: "Deben estar completos todos los campos excepto el thumbnail"})
    }
    
    const product = ({
        title,
        description,
        code,
        price: Number(price),
        status: true,
        stock: Number(stock),
        category,
        thumbnails,
    })

    try {
        PM.addProduct(product);
        res.json({
            status: "Creado"
        })
    }
    catch (error){
        return res.status(400).json({error: error.message})
    }
})

router.put("/:pid", (req, res) => {
    const { pid } = req.params;
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        PM.updateProduct(pid, {
            id: Number(pid),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails,
        })

        res.json({
            status: "Actualizado"
        })
    }
    catch (error) {
        return res.json({error: error.message});
    }
})

router.delete("/:pid", (req, res) => {
    const { pid } = req.params;
    try {
        PM.deteleProduct(pid);
        res.json({
            status: "Eliminado"
        });
    }
    catch (error){
        res.status(400).json({error: error.message});
    }
})

export default router;