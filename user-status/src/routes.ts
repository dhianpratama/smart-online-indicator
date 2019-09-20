import RxRouter from "koa-router-rx";
import { livenessHandler } from "./handlers/healthcheck/liveness_handler";
import { getUserStatusByIdHandler } from "./handlers/users/get_user_by_id_handler";
import { getUsersHandler } from "./handlers/users/get_users_handler";
import { postOfflineCheckerHandler } from "./handlers/users/post_offline_checker_handler";
import { postUserHandler } from "./handlers/users/post_user_handler";

const router = new RxRouter();

router.get("/liveness", livenessHandler);
router.get("/users/:user_id/status", getUserStatusByIdHandler);
router.get("/users/status", getUsersHandler);
router.post("/users/status", postUserHandler);
router.post("/users/status/offline-checker", postOfflineCheckerHandler);

export { router };
