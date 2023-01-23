import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone: {
    type: Number,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  backUpLogo: {
    type: String,
    required: false,
  },
  contacted: {
    type: String,
    required: false,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Contact = model("Contact", contactSchema, "contacts");

export default Contact;
