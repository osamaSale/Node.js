const express = require("express");
const { upload } = require("../connection/upload")
const { getUserList, register, deleteUser, editUser, search, singleUser, login } = require("../controller/users");
const { getProductsList, singleProduct, searchProduct, createProduct, editProduct, deleteProduct } = require("../controller/products");
const { getListCart, createCart, deleteCart, editCart, singleCart, searchCart, findCartUser } = require("../controller/cart");
const { getListOrders, singleOrder, searchOrder, createOrder, deleteOrder, editOrder, findOrderUser, allOrdersProduct, findOrderUserProducts } = require("../controller/orders");
const { getContactList, singleContact, deleteContact, searchContact, editContact, createContact } = require("../controller/contact");
const { getNewsList, singleNews, createNews, searchNews, deleteNews, editNews } = require("../controller/news");
const { getListSave, createSave, findSaveUser, deleteSave, editSave } = require("../controller/save");
const { getBrands, singleBrands, searchBrands, createBrands, editBrands, deleteBrands } = require("../controller/brands");
const { getDevicesList, singleDevices, searchDevices, createDevices, editDevices, deleteDevices } = require("../controller/devices");
const router = express.Router();

// =========================  Router Users =================================== //


router.get("/users", getUserList)
router.get("/users/single/:id", singleUser)
router.post("/users", upload.single("image"), register)
router.put("/users", upload.single("image"), editUser)
router.delete("/users/:id", deleteUser)
router.get("/users/search/:name", search)
router.post("/users/login", login)




// ========================== Router Devices ==================================== //

router.get("/devices", getDevicesList)
router.get("/devices/single/:id", singleDevices)
router.get("/devices/search/:name", searchDevices)
router.post("/devices", upload.single("image"), createDevices)
router.put("/devices", upload.single("image"), editDevices)
router.delete("/devices/:id", deleteDevices)

// ========================== Router Brands ==================================== //

router.get("/brands", getBrands)
router.get("/brands/single/:id", singleBrands)
router.get("/brands/search/:name", searchBrands)
router.post("/brands",  createBrands)
router.put("/brands",  editBrands)
router.delete("/brands/:id", deleteBrands)

// ======================== Router Products ========================================//

router.get("/products", getProductsList)
router.get("/products/single/:id", singleProduct)
router.get("/products/search/:name", searchProduct)
router.post("/products", upload.single("image"), createProduct)
router.put("/products", upload.single("image"), editProduct)
router.delete("/products/:id", deleteProduct)

// ======================== Router Save ============================================//

router.get("/save", getListSave)
router.post("/save", createSave)
router.put("/save", editSave)
router.get("/save/findSaveUser/:userId", findSaveUser)
router.delete("/save/:id", deleteSave)

// ======================== Router Cart ============================================//

router.get("/cart", getListCart)
router.get("/cart/single/:id", singleCart)
router.get("/cart/search/:userId", searchCart)
router.post("/cart", createCart)
router.delete("/cart/:id", deleteCart)
router.put("/cart", editCart)
router.get("/cart/user/:userId", findCartUser)


// ======================== Router Contact ============================================//

router.get("/contact", getContactList)
router.get("/contact/single/:id", singleContact)
router.get("/contact/search/:name", searchContact)
router.post("/contact", createContact)
router.delete("/contact/:id", deleteContact)
router.put("/contact", editContact)

// ======================== Router News ============================================//

router.get("/news", getNewsList)
router.get("/news/single/:id", singleNews)
router.get("/news/search/:email", searchNews)
router.post("/news", createNews)
router.delete("/news/:id", deleteNews)
router.put("/news", editNews)

// ======================== Router Orders ============================================//

router.get("/orders", getListOrders)
router.get("/orders/search/:userId", searchOrder)
router.post("/orders", createOrder)
router.delete("/orders/:orderid", deleteOrder)
router.put("/orders", editOrder)
router.get("/orders/user/products/:userId", findOrderUserProducts)









module.exports = router;
