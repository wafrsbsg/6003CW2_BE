const {Router} = require("express")
const {getUser, saveUser} = require("../controllers/UserController")
const router = Router()

router.get("/get", getUser);
router.post("/register", saveUser);

module.exports = router;