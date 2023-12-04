import express from "express";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js"
import { ProductManager, Product } from "../manager/productManager.js";

const app = express();
const PORT = 8080;

const httpServer = app.listen(8080, () => {console.log(`Server listening on port ${PORT}`)});

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`))

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const PM = new ProductManager("./src/products.json");

io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("product_send", async (data) => {
        console.log(data);
        try {
            const product = new Product(data.title, data.description, Number(data.price), data.thumbnails, data.code, Number(data.stock))
            await PM.addProduct(product);
            socket.emit("products", PM.getProducts());
        }
        catch (error) {
            console.log(error);
        } 
    });

    socket.emit("products", PM.getProducts());
});

