import type { Request, Response, NextFunction } from "express";
import {
  addNewContact,
  deleteContact,
  loadAllContacts,
  loadContact,
  loadContactsBySector,
  updateContact,
} from "./contactsControlller";
import {
  mockContact,
  mockContactBySector,
  mockContactDetails,
  mockContactUpdate,
} from "../../../mocks/mockContact";
import Contact from "../../../database/models/business/business";
import CustomError from "../../customError/customError";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a contactsController", () => {
  describe("When it is invoked with loadAllContacts method with the business 'app2U' at the data base", () => {
    test("Then it should respond with a 200 status", async () => {
      const status = 200;
      const req: Partial<Request> = {
        query: {
          page: "1",
        },
      };

      Contact.find = jest.fn().mockReturnValue(mockContact);
      await loadAllContacts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it is invoked with loadAllContacts method with no business in the data base", () => {
    test("Then it should respond with a 204 status", async () => {
      const customError = new CustomError(
        "There are no contacts",
        204,
        "There are no contacts"
      );
      const req: Partial<Request> = {
        query: {
          page: "1",
        },
      };

      Contact.find = jest.fn().mockRejectedValue(customError);
      await loadAllContacts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with loadAllContacts method with no business in the data base", () => {
    test("Then it should respond with a 204 status", async () => {
      const req: Partial<Request> = {
        query: {
          page: "1",
        },
      };
      const customError = new CustomError(
        "There are no contacts!",
        204,
        "There are no contacts!"
      );

      Contact.find = jest.fn().mockReturnValueOnce(null);
      await loadAllContacts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with it is invoked with the method loadContact with Accent Systems id", () => {
    test("Then it should return Accent Systems information", async () => {
      const status = 200;
      const req: Partial<Request> = {
        params: { id: "637e36a2af517156aa098996" },
      };

      Contact.findById = jest.fn().mockReturnValue(mockContactDetails);
      await loadContact(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it is invoked with the method loadContact and an internal server error happens", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "We couldn't find any user due to a internal server error!",
        204,
        "We couldn't find any user due to a internal server error!"
      );
      const req: Partial<Request> = {
        params: { id: "637e36a2af517156aa098911" },
      };

      Contact.findById = jest.fn().mockRejectedValue(customError);
      await loadContact(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with it is invoked with the method loadContact with an invalid id", () => {
    test("Then it should return Accent Systems information", async () => {
      const customError = new CustomError(
        "Contact not found!",
        204,
        "Contact not found!"
      );
      const req: Partial<Request> = {
        params: { id: "637e36a2af517156aa098111" },
      };

      Contact.findById = jest.fn().mockReturnValue(null);
      await loadContact(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with the method deleteContact", () => {
    test("Then it should delete the contact 'Acccent Systems'", async () => {
      const status = 200;
      const req: Partial<Request> = {
        params: { id: mockContactDetails.id },
      };

      Contact.findByIdAndDelete = jest.fn().mockReturnValue(mockContact);
      await deleteContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it is invoked with the method deleteContact and an internal server error ocurres", () => {
    test("Then it should call it's next method with a custom error", async () => {
      const customError = new CustomError(
        "Error deleting the contact",
        500,
        "Error deleting the contact"
      );
      const req: Partial<Request> = {
        params: { id: "123455" },
      };

      Contact.findByIdAndDelete = jest.fn().mockRejectedValue(customError);
      await deleteContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with the method deleteContact and it does not found a contact", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "Couldn't find the contact",
        500,
        "Couldn't find the contact"
      );
      const req: Partial<Request> = {
        params: { id: "123455" },
      };

      Contact.findByIdAndDelete = jest.fn().mockReturnValue(null);
      await deleteContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with the method addNewContact", () => {
    test("Then it should return a status 201", async () => {
      const status = 201;
      const file: Partial<Express.Multer.File> = {
        filename: "contact-12345.webp",
        originalname: "contact-12345.webp",
      };
      const req: Partial<Request> = {
        body: {
          name: "Accent Systems",
          email: "info@accent-systems.com",
          telephone: 935125138,
          sector: "Technology",
          website: "https://accent-systems.com/es/",
          service: "Technical Engineering Services",
          logo: file,
          contacted: 2020,
          id: "637e36a2af517156aa098996",
        },
      };
      req.file = file as Express.Multer.File;

      Contact.create = jest.fn().mockReturnValue(mockContactDetails);

      await addNewContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it is invoked with the method addNewContact and an internal server error happens", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "Error creating the contact!",
        500,
        "Error creating the contact!"
      );
      const file: Partial<Express.Multer.File> = {
        filename: "contact-12345.webp",
        originalname: "contact-12345.webp",
      };
      const req: Partial<Request> = {
        body: {
          name: "Accent Systems",
          email: "info@accent-systems.com",
          telephone: 935125138,
          sector: "Technology",
          website: "https://accent-systems.com/es/",
          service: "Technical Engineering Services",
          logo: file,
          contacted: 2020,
          id: "637e36a2af517156aa098996",
        },
      };
      req.file = file as Express.Multer.File;

      Contact.create = jest.fn().mockRejectedValue(customError);
      await addNewContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with the method updateContact", () => {
    test("Then it should return a 201 status", async () => {
      const status = 201;
      const file: Partial<Express.Multer.File> = {
        filename: "contact-12345.webp",
        originalname: "contact-12345.webp",
      };
      const req: Partial<Request> = {
        params: { id: "637e36a2af517156aa098996" },
        body: {
          name: "Accent Systems",
          email: "info@accent-systems.com",
          telephone: 935125138,
          sector: "Technology",
          website: "https://accent-systems.com/es/",
          service: "Technical Engineering Services",
          logo: file,
          contacted: "11/12/2020",
          id: "637e36a2af517156aa098996",
        },
      };
      req.file = file as Express.Multer.File;

      Contact.findByIdAndUpdate = jest.fn().mockReturnValue(mockContactUpdate);
      await updateContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it is invoked with the method updateContact and an internal server error happens", () => {
    test("Then it should return a 500 status", async () => {
      const customError = new CustomError(
        "Error updating the contact",
        500,
        "Error updating the contact"
      );
      const file: Partial<Express.Multer.File> = {
        filename: "contact-12345.webp",
        originalname: "contact-12345.webp",
      };
      const req: Partial<Request> = {
        params: { id: "637" },
        body: {
          name: "Accent Systems",
          email: "info@accent-systems.com",
          telephone: 935125138,
          sector: "Technology",
          website: "https://accent-systems.com/es/",
          service: "Technical Engineering Services",
          logo: file,
          contacted: "11/12/2020",
          id: "637e36a2af517156aa09899334",
        },
      };
      req.file = file as Express.Multer.File;

      Contact.findByIdAndUpdate = jest.fn().mockRejectedValue(customError);
      await updateContact(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with the method loadContactsBySector", () => {
    test("Then it should return a 200 status", async () => {
      const status = 200;
      const req: Partial<Request> = {
        params: { sector: "Marketing" },
      };

      Contact.find = jest.fn().mockReturnValue(mockContactBySector);
      await loadContactsBySector(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When it is invoked with the method loadContactsBySector and no contact are found", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "No contacts found!",
        204,
        "No contacts found!"
      );
      const req: Partial<Request> = {
        params: { sector: "Culture" },
      };

      Contact.find = jest.fn().mockReturnValueOnce(null);
      await loadContactsBySector(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it is invoked with the method loadContactsBySector and an internal server error happens", () => {
    test("Then it should call it's next method with a customError", async () => {
      const customError = new CustomError(
        "Error loading the contacts!",
        500,
        "Error loading the contacts!"
      );
      const req: Partial<Request> = {
        params: { sector: "Culture" },
      };

      Contact.find = jest.fn().mockRejectedValue(customError);
      await loadContactsBySector(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
