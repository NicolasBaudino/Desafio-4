import { Router } from "express";
import cartManager from "../../manager/cartManager.js"

const router = Router();

const CM = new cartManager("./src/cart.json")

router.post("/", (req, res) => {
    try {
        CM.addCart();
        res.json({
            status: "Creado"
        })
    }
    catch (error){
        return res.status(400).json({error: "No se pudo crear"})
    }
});

router.get("/", (req, res) => {
    const { limit } = req.query;
    const carts = CM.getCarts();
    if (limit) {
        const limitOptions = carts.slice(0, limit);
        return res.json(limitOptions);
    }
    else {
        return res.json(carts);
    }
});

router.get("/:cid", (req, res) => {
    const { cid } = req.params;
    try {
        const cartFind = CM.getCartById(cid);
        return res.json(cartFind);
    }
    catch (error) {
        return res.status(400).json({error: error.message})
    }
});

router.post("/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params;
    try {
        CM.addProductCart(cid, pid);
        res.json({
            status: "Se añadió el producto al carrito"
        });
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
})


export default router;