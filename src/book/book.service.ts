import { db } from "../utils/db.server";
import { Author } from "../author/author.service";

type BookRead = {
  id: number;
  title: string;
  datePuplished: Date;
  isFiction: boolean;
  author: Author;
  //   authorId: number;
};

type BookWrite = {
  title: string;
  authorId: number;
  isFiction: boolean;
  datePuplished: Date;
};

export const listBooks = async (): Promise<BookRead[]> => {
  return db.book.findMany({
    select: {
      id: true,
      title: true,
      datePuplished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      //   authorId: true,
    },
  });
};

export const getBook = async (id: number): Promise<BookRead | null> => {
  return db.book.findUnique({
    select: {
      id: true,
      title: true,
      datePuplished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    where: {
      id,
    },
  });
};

export const createBook = async (book: BookWrite): Promise<BookRead> => {
  const { title, authorId, isFiction, datePuplished } = book;
  const parsedDate: Date = new Date(datePuplished);

  return db.book.create({
    data: {
      title,
      authorId,
      isFiction,
      datePuplished,
    },
    select: {
      id: true,
      title: true,
      datePuplished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateBook = async (
  book: BookWrite,
  id: number
): Promise<BookRead> => {
  const { title, authorId, isFiction, datePuplished } = book;
  return db.book.update({
    data: {
      title,
      authorId,
      isFiction,
      datePuplished,
    },
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      datePuplished: true,
      isFiction,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteBook = async (id: number): Promise<void> => {
  await db.book.delete({
    where: {
      id,
    },
  });
};
