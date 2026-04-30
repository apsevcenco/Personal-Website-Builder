import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import contentRouter from "./content";
import adminRouter from "./admin";
import inquiriesRouter from "./inquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(contentRouter);
router.use(adminRouter);
router.use(inquiriesRouter);

export default router;
