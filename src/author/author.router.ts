import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as AuthorService from "./author.service";
import { request } from "http";

export const authorRouter = express.Router();

//GET: List of all Authors
authorRouter.get("/", async (request: Request, response: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    response.status(200).json(authors);
    return;
  } catch (error: any) {
    response.status(500).json(error.message);
    return;
  }
});

//GET: a single Author
authorRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const author = await AuthorService.getAuthor(id);
    if (author) {
      response.status(200).json(author);
      return;
    }
    response.status(404).json("Author not found!");
  } catch (error: any) {
    response.status(500).json(error.message);
    return;
  }
});

//POST: an Author
authorRouter.post(
  "/",
  body("firstName").isString(),
  body("lastName").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const author = request.body;
      const newAuthor = await AuthorService.createAuthor(author);
      response.status(201).json(newAuthor);
      return;
    } catch (error: any) {
      response.status(500).json(error.message);
      return;
    }
  }
);

//UPDATE/PUT: an Author
authorRouter.put(
  "/:id",
  body("firstName").isString(),
  body("lastName").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    const id: number = parseInt(request.params.id);
    if (!errors.isEmpty()) {
      response.status(400).json({ error: errors.array() });
      return;
    }
    try {
      const author = request.body;
      const updatedAuthor = await AuthorService.updateAuthor(author, id);
      response.status(200).json(updatedAuthor);
      return;
    } catch (error: any) {
      response.status(500).json(error.message);
      return;
    }
  }
);

//DELETE: an Author
authorRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id);
  try {
    await AuthorService.removeAuthor(id);
    response.status(204).json("Author has been deleted successfully!");
    return;
  } catch (error: any) {
    response.status(500).json(error.message);
    return;
  }
});
