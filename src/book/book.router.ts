import express from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as BookService from "./book.service";

export const bookRouter = express.Router();

//GET: List all books
bookRouter.get("/", async (request: Request, response: Response) => {
  try {
    const books = await BookService.listBooks();
    response.status(200).json(books);
    return;
  } catch (error: any) {
    response.status(500).json(error.message);
    return;
  }
});

//GET: Single Book
bookRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id);
  try {
    const book = await BookService.getBook(id);
    if (!book) {
      response.status(404).json("Book not found!");
      return;
    }
    response.status(200).json(book);
    return;
  } catch (error: any) {
    response.status(500).json(error.message);
    return;
  }
});

//POST/CREATE: New Book
bookRouter.post(
  "/",
  body("title").isString(),
  body("authorId").isInt(),
  body("isFiction").isBoolean(),
  body("datePuplished").isDate().toDate(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const book = request.body;
      const newBook = await BookService.createBook(book);
      response.status(201).json(newBook);
      return;
    } catch (error: any) {
      response.status(500).json(error.message);
      return;
    }
  }
);

//UPDATE: Book by id
bookRouter.put(
  "/:id",
  body("title").isString(),
  body("authorId").isInt(),
  body("isFiction").isBoolean(),
  body("datePuplished").isDate().toDate(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    const id: number = parseInt(request.params.id);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const book = request.body;
      const updatedBook = await BookService.updateBook(book, id);
      response.status(200).json(updatedBook);
      return;
    } catch (error: any) {
      response.status(500).json(error.message);
    }
  }
);

//DELETE: Book by id
bookRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id);
  try {
    await BookService.deleteBook(id);
    response.status(204).json("Book deleted successfully!");
    return;
  } catch (error: any) {
    response.status(500).json(error.message);
  }
});
