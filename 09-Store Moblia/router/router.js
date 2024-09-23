const express = require("express");
const { upload } = require("../connection/upload")
const { getAllUsers, createUser, deleteUser, editUser, login, searchUser, updatePassword } = require("../controller/users");
const { getAllBrands, createBrands, editBrands, deleteBrands, searchBrands } = require("../controller/brands");
const { getAllDevices, createDevices, editDevices, deleteDevices, searchDevices } = require("../controller/devices");
const { getAllProducts, createProduct, editProduct, deleteProduct, searchProducts, singleProduct } = require("../controller/products");
const { getAllContact, createContact, editContact, deleteContact, searchContact } = require("../controller/contact");
const { getAllNews, createNews, editNews, deleteNews, searchNews } = require("../controller/news");
const { getAllWishlist, createWishlist, editWishlist, deleteWishlist, searchWishlist } = require("../controller/wishlist");
const { getAllCarts, createCart, editCart, deleteCart, searchCarts } = require("../controller/carts");
const { getAllOrders, createOrder, deleteOrder, editOrder } = require("../controller/orders");
const { getAllComments, createComments, editComment, deleteComment, searchComments } = require("../controller/comments");
const router = express.Router();
/* ============================= Users ========================================= */
router.get("/users", getAllUsers)
router.post("/users", upload.single("image"), createUser)
router.delete("/users/:id", deleteUser)
router.put("/users", upload.single("image"), editUser)
router.put("/users/updatePassword", updatePassword)
router.post("/users/login", login)
router.get("/users/search/:name", searchUser)

/* ============================= Brands ========================================= */

router.get("/brands", getAllBrands)
router.post("/brands", createBrands)
router.put("/brands", editBrands)
router.delete("/brands/:id", deleteBrands)
router.get("/brands/search/:name", searchBrands)


/* ============================= Devices ========================================= */

router.get("/devices", getAllDevices)
router.post("/devices", upload.single("image"), createDevices)
router.put("/devices", upload.single("image"), editDevices)
router.delete("/devices/:id", deleteDevices)
router.get("/devices/search/:name", searchDevices)

/* ============================= Products ========================================= */

router.get("/products", getAllProducts)
router.get("/products/single/:id", singleProduct)
router.post("/products", upload.single("image"), createProduct)
router.put("/products", upload.single("image"), editProduct)
router.delete("/products/:id", deleteProduct)
router.get("/products/search/:search", searchProducts)



/* ============================= Contact ========================================= */

router.get("/contact", getAllContact)
router.post("/contact", createContact)
router.put("/contact", editContact)
router.delete("/contact/:id", deleteContact)
router.get("/contact/search/:name", searchContact)


/* ============================= News ========================================= */

router.get("/news", getAllNews)
router.post("/news", createNews)
router.put("/news", editNews)
router.delete("/news/:id", deleteNews)
router.get("/news/search/:email", searchNews)

/* ============================= wishlist ========================================= */

router.get("/wishlist", getAllWishlist)
router.post("/wishlist", createWishlist)
router.put("/wishlist", editWishlist)
router.delete("/wishlist/:id", deleteWishlist)
router.get("/wishlist/search/:name", searchWishlist)

/* ============================= Carts ========================================= */

router.get("/carts", getAllCarts)
router.post("/carts", createCart)
router.put("/carts", editCart)
router.delete("/carts/:id", deleteCart)
router.get("/carts/search/:name", searchCarts)

/* ============================= Orders ========================================= */

router.get("/orders", getAllOrders)
router.post("/orders", createOrder)
router.put("/orders", editOrder)
router.delete("/orders/:orderid", deleteOrder)
/* ============================= Comments ========================================= */

router.get("/comments", getAllComments)
router.post("/comments", createComments)
router.put("/comments", editComment)
router.delete("/comments/:id", deleteComment)
router.get("/comments/search/:comment", searchComments)


module.exports = router;