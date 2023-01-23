import routes from "../../routes/routes.js";
import express from "express";
import multer from "multer";
import path from "path";
import { validate } from "express-validation";
import {
  deleteContact,
  loadAllContacts,
  loadContact,
  addNewContact,
  updateContact,
  loadContactsBySector,
} from "../../controllers/contactsController/contactsControlller.js";
import auth from "../../middlewares/auth/auth.js";
import businessSchema from "../../schemas/businessSchema.js";
import rename from "../../middlewares/images/rename/rename.js";
import resize from "../../middlewares/images/resize/resize.js";
import uploadLogo from "../../middlewares/images/upload/upload.js";

// eslint-disable-next-line new-cap
const contactsRouter = express.Router();

const upload = multer({
  dest: path.join("assets"),
});

contactsRouter.get(routes.loadAllContacts, auth, loadAllContacts);

contactsRouter.get(routes.loadContact, auth, loadContact);
contactsRouter.post(
  routes.addNewContact,
  auth,
  upload.single("logo"),
  validate(businessSchema, {}, { abortEarly: false }),
  rename,
  resize,
  uploadLogo,
  addNewContact
);

contactsRouter.delete(routes.deleteContact, auth, deleteContact);

contactsRouter.patch(
  routes.updateContact,
  auth,
  upload.single("logo"),
  rename,
  resize,
  uploadLogo,
  updateContact
);

contactsRouter.get(routes.loadContactsBySector, auth, loadContactsBySector);
export default contactsRouter;
