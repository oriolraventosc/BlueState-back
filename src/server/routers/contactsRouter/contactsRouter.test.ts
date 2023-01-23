import routes from "../../routes/routes";
import enviroment from "../../../loadEnviroment";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import connectToDatabase from "../../../database/index";
import mongoose from "mongoose";
import app from "../../app";
import Contact from "../../../database/models/business/business";
import { mockContact, mockContactDetails } from "../../../mocks/mockContact";
import CustomError from "../../customError/customError";

const { jwtSecretKey } = enviroment;

let server: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

beforeEach(async () => {
  await Contact.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const userId = 12345;

const userToken = jwt.sign(
  { username: "admin", id: userId.toString() },
  jwtSecretKey
);

describe("Given a GET /contact/list", () => {
  describe("When it receives a request with an empty body and 10 contacts in the data base", () => {
    test("Then it should respond with a 200 status", async () => {
      const status = 200;

      const response = await request(app)
        .get(`${routes.contact}${routes.loadAllContacts}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("next");
      expect(response.body).toHaveProperty("previous");
      expect(response.body).toHaveProperty("contacts");
    });
  });

  describe("When it receives a request with no contacts in the data base", () => {
    test("Then it should respond with a 204 status", async () => {
      const status = 204;

      Contact.find = jest.fn().mockReturnValue(null);

      const response = await request(app)
        .get(`${routes.contact}${routes.loadAllContacts}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });

  describe("When it receives a request and an interval server error happens", () => {
    test("Then it should return a 500 status", async () => {
      const status = 500;

      Contact.find = jest
        .fn()
        .mockRejectedValue({ error: "Opps...General Error" });

      const response = await request(app)
        .get(`${routes.contact}${routes.loadAllContacts}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({ error: "Opps...General Error" });
    });
  });
});

describe("Given a GET /contact/:id", () => {
  describe("When it receives a request with the id '637e36a2af517156aa098996'", () => {
    test("Then it should return the contact Accent Systems", async () => {
      const status = 200;

      Contact.findById = jest.fn().mockReturnValue(mockContactDetails);

      const response = await request(app)
        .get(`${routes.contact}/637e36a2af517156aa098996`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("telephone");
      expect(response.body).toHaveProperty("sector");
      expect(response.body).toHaveProperty("website");
      expect(response.body).toHaveProperty("service");
      expect(response.body).toHaveProperty("logo");
      expect(response.body).toHaveProperty("backUpLogo");
    });
  });

  describe("When it receives a request with an invalid id", () => {
    test("Then it should return an empty object", async () => {
      const status = 204;

      Contact.findById = jest.fn().mockReturnValue(null);

      const response = await request(app)
        .get(`${routes.contact}/637e36adñf517156aa123996`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });

  describe("When it receives a request and an internal server error happens", () => {
    test("Then ti should call it's next method with a custom error", async () => {
      const status = 500;
      const customError = new CustomError(
        "We couldn't find any user due to a internal server error!",
        500,
        "We couldn't find any user due to a internal server error!"
      );

      Contact.findById = jest.fn().mockRejectedValue(customError);

      const response = await request(app)
        .get(`${routes.contact}/637e36adñf517156aa123996`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({
        error: "We couldn't find any user due to a internal server error!",
      });
    });
  });
});

describe("Given a DELETE '/contact/delete/:id' endpoint", () => {
  describe("When it receives a request with a valid id", () => {
    test("Then it should delete the contact 'Accent Systems'", async () => {
      const status = 200;

      Contact.findByIdAndDelete = jest.fn().mockReturnValue(mockContactDetails);

      const response = await request(app)
        .delete(`${routes.contact}/delete/${mockContactDetails.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({ contact: mockContactDetails });
    });
  });

  describe("When it receives a request and an internal server error ocurres", () => {
    test("Then it should call it's next method with a customError", async () => {
      const status = 500;
      const customError = new CustomError(
        "Error deleting the contact",
        500,
        "Error deleting the contact"
      );

      Contact.findByIdAndDelete = jest.fn().mockRejectedValue(customError);

      const response = await request(app)
        .delete(`${routes.contact}/delete/${mockContactDetails.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({
        error: "Error deleting the contact",
      });
    });
  });

  describe("When it receives a request and it does not found", () => {
    test("Then it should call it's next method with a customError", async () => {
      const status = 400;

      Contact.findByIdAndDelete = jest.fn().mockReturnValue(null);

      const response = await request(app)
        .delete(`${routes.contact}/delete/${mockContactDetails.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({
        error: "Couldn't find the contact",
      });
    });
  });
});

describe("Given a POST '/contact/add-new-contact' endpoint", () => {
  const file: Partial<Express.Multer.File> = {
    filename: "accentSystems-12345.jpg",
    originalname: "accentSystems-12345.jpg",
  };

  const contact = {
    name: "Accent Systems",
    email: "info@accent-systems.com",
    telephone: 935125138,
    sector: "Technology",
    website: "https://accent-systems.com/es/",
    service: "Technical Engineering Services",
    logo: file,
    contacted: 2020,
    id: "637e36a2af517156aa098996",
  };
  describe("When it receives a request with a file 'contact.jpg' and an internal server error happens", () => {
    test("Then it should return a 500 status", async () => {
      const customError = new CustomError(
        "Error creating the contact!",
        500,
        "Error creating the contact!"
      );
      const status = 500;

      Contact.create = jest.fn().mockRejectedValue(customError);

      const response = await request(app)
        .post(`${routes.contact}${routes.addNewContact}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(contact)
        .expect(status);

      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("Given a GET '/contacts/list/:sector' endpoint", () => {
  describe("When it receives a request with a sector param 'Marketing'", () => {
    test("Then it should return a list of contacts", async () => {
      const status = 200;
      Contact.find = jest.fn().mockReturnValue(mockContact);

      const response = await request(app)
        .get(`${routes.contact}/list/Marketing`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toHaveProperty("contacts");
    });
  });

  describe("When it receives a request with a sector param 'marketing'", () => {
    test("Then it shpuld return an empty list", async () => {
      const status = 204;
      Contact.find = jest.fn().mockReturnValue(null);

      const response = await request(app)
        .get(`${routes.contact}/list/marketing`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });

  describe("When it receives a request with a sector 'Marketing' and an internal server error happens", () => {
    test("Then it should return a customError", async () => {
      const customError = new CustomError(
        "Error loading the contacts!",
        500,
        "Error loading the contacts!"
      );
      const status = 500;
      Contact.find = jest.fn().mockRejectedValue(customError);

      const response = await request(app)
        .get(`${routes.contact}/list/Marketing`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(status);

      expect(response.body).toHaveProperty("error");
    });
  });
});
