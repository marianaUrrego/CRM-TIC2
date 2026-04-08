import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

console.log("Customer routes loaded");

router.get("/customers", authMiddleware, CustomerController.getAll);
router.post("/customers", authMiddleware, CustomerController.create);
router.delete("/customers/:id", authMiddleware, CustomerController.delete);
router.patch("/customers/:id/status", authMiddleware, CustomerController.updateStatus);

export default router;