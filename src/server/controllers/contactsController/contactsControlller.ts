import enviroment from "../../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import debugCreator from "debug";
import Contact from "../../../database/models/business/business.js";
import CustomError from "../../customError/customError.js";
import chalk from "chalk";
import pagination from "../../../utils/pagination.js";
import type { ContactStructure } from "./types.js";

const debug = debugCreator(`${enviroment.debug}controllers`);

export const loadAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page } = req.query;

  try {
    const contacts = await Contact.find();

    if (!contacts) {
      const customError = new CustomError(
        "There are no contacts!",
        204,
        "There are no contacts!"
      );
      next(customError);
    }

    const options = {
      page: page?.length >= 1 ? Number(page) : 1,
      limit: 10,
    };

    let previousPage = options.page - 1;
    let nextPage = options.page + 1;

    const pageCount = Math.ceil(contacts.length / options.limit);

    if (options.page >= pageCount + 1) {
      options.page = 1;
      nextPage = 2;
      previousPage = 0;
    }

    res.status(200).json({
      total: contacts.length,
      next: `https://oriol-raventos-back-final-project-202209.onrender.com/contact/list?page=${nextPage}`,
      previous: `https://oriol-raventos-back-final-project-202209.onrender.com/contact/list?page=${previousPage}`,
      contacts: pagination(contacts, options.limit, options.page),
    });
    debug(chalk.green(`${contacts.length} contacts found`));
  } catch (error: unknown) {
    next(error);
    debug(chalk.red("We couldn't find any contact"));
  }
};

export const loadContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      const customError = new CustomError(
        "Contact not found!",
        204,
        "Contact not found!"
      );
      next(customError);
      return;
    }

    res.status(200).json(contact);
    debug(chalk.green(`1 contact found!`));
  } catch {
    const customError = new CustomError(
      "We couldn't find any user due to a internal server error!",
      500,
      "We couldn't find any user due to a internal server error!"
    );
    debug(
      chalk.red("We couldn't find any user due to a internal server error!")
    );
    next(customError);
  }
};

export const addNewContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contactData = req.body as ContactStructure;
  try {
    const contactToAdd = await Contact.create({
      ...contactData,
    });

    res.status(201).json({ contact: contactToAdd });
    debug(chalk.green(`${contactData.name} added!`));
  } catch {
    const customError = new CustomError(
      "Error creating the contact!",
      500,
      "Error creating the contact"
    );
    next(customError);
  }
};

export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      const customError = new CustomError(
        "Couldn't find the contact",
        400,
        "Couldn't find the contact"
      );
      next(customError);
      return;
    }

    res.status(200).json({ contact });
    debug(chalk.green("Contact deleted successfully!"));
  } catch {
    const customError = new CustomError(
      "Error deleting the contact",
      500,
      "Error deleting the contact"
    );
    next(customError);
  }
};

export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const contact = req.body as ContactStructure;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { ...contact },
      { returnDocument: "after" }
    );
    const { name } = updatedContact;
    res.status(201).json({ contact: updatedContact });
    debug(chalk.greenBright(`${name} updated successfully!`));
  } catch {
    const customError = new CustomError(
      "Error updating the contact",
      500,
      "Error updating the contact"
    );
    next(customError);
  }
};

export const loadContactsBySector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sector } = req.params;
  try {
    const contacts = await Contact.find({ sector });
    if (!contacts) {
      const customError = new CustomError(
        "No contacts found!",
        204,
        "No contacts found!"
      );
      next(customError);
      return;
    }

    res.status(200).json({ contacts });
    debug(chalk(`${contacts.length} contacts found!`));
  } catch {
    const customError = new CustomError(
      "Error loading the contacts!",
      500,
      "Error loading the contacts!"
    );
    next(customError);
  }
};
