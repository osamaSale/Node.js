const express = require("express");
const { upload } = require("../connection/upload")
const { getAllUsers, singleUser, createUser, deleteUser, editUser, login } = require("../controller/users");
const { getAllBrands, createBrands, editBrands, deleteBrands } = require("../controller/brands");
const { getAllDevices, createDevices, editDevices, deleteDevices } = require("../controller/devices");
const { getAllProducts, createProduct, editProduct, deleteProduct } = require("../controller/products");
const { getAllContact, createContact, editContact, deleteContact } = require("../controller/contact");
const { getAllNews, createNews, editNews, deleteNews } = require("../controller/news");
const { getAllWishlist, createWishlist, editWishlist, deleteWishlist } = require("../controller/wishlist");
const { getAllCarts, createCart, editCart, deleteCart } = require("../controller/carts");
const { getAllOrders, createOrder, deleteOrder, editOrder } = require("../controller/orders");
const router = express.Router();
/* ============================= Users ========================================= */
router.get("/users", getAllUsers)
router.get("/users/single/:id", singleUser)
router.post("/users", upload.single("image"), createUser)
router.delete("/users/:id", deleteUser)
router.put("/users", upload.single("image"), editUser)
router.post("/users/login", login)

/* ============================= Brands ========================================= */

router.get("/brands", getAllBrands)
router.post("/brands", createBrands)
router.put("/brands", editBrands)
router.delete("/brands/:id", deleteBrands)


/* ============================= Devices ========================================= */

router.get("/devices", getAllDevices)
router.post("/devices", upload.single("image"), createDevices)
router.put("/devices", upload.single("image"), editDevices)
router.delete("/devices/:id", deleteDevices)

/* ============================= Products ========================================= */

router.get("/products", getAllProducts)
router.post("/products", upload.single("image"), createProduct)
router.put("/products", upload.single("image"), editProduct)
router.delete("/products/:id", deleteProduct)


/* ============================= Contact ========================================= */

router.get("/contact", getAllContact)
router.post("/contact", createContact)
router.put("/contact", editContact)
router.delete("/contact/:id", deleteContact)


/* ============================= News ========================================= */

router.get("/news", getAllNews)
router.post("/news", createNews)
router.put("/news", editNews)
router.delete("/news/:id", deleteNews)


/* ============================= wishlist ========================================= */

router.get("/wishlist", getAllWishlist)
router.post("/wishlist", createWishlist)
router.put("/wishlist", editWishlist)
router.delete("/wishlist/:id", deleteWishlist)

/* ============================= Carts ========================================= */

router.get("/carts", getAllCarts)
router.post("/carts", createCart)
router.put("/carts", editCart)
router.delete("/carts/:id", deleteCart)

/* ============================= Orders ========================================= */

router.get("/orders", getAllOrders)
router.post("/orders", createOrder)
router.put("/orders", editOrder)
router.delete("/orders/:orderid", deleteOrder)


module.exports = router;