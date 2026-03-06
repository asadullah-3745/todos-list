const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const controller = require("../controllers/taskController");

router.get("/", authMiddleware, controller.getTasks);
router.get("/:id", authMiddleware, controller.getTask);
router.post("/", authMiddleware, controller.createTask);
router.put("/:id", authMiddleware, controller.updateTask);
router.delete("/:id", authMiddleware, controller.deleteTask);

module.exports = router;