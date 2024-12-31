import { db } from "../src/uitils/db.server";

type Author = {
  firstName: string;
  lastName: string;
};

type Book = {
  title: string;
  isFiction: boolean;
  datePuplished: Date;
};

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.author.create({
        data: {
          firstName: author.firstName,
          lastName: author.lastName,
        },
      });
    })
  );
  const author = await db.author.findFirst({
    where: {
      firstName: "Yuval Noah",
    },
  });

  if (!author) {
    throw new Error("Author not found");
  }

  await Promise.all(
    getBooks().map((book) => {
      const { title, isFiction, datePuplished } = book;
      return db.book.create({
        data: {
          title,
          isFiction,
          datePuplished,
          authorId: author.id,
        },
      });
    })
  );
}

seed();

function getAuthors(): Array<Author> {
  return [
    {
      firstName: "John",
      lastName: "Doe",
    },
    {
      firstName: "William",
      lastName: " Shakespeare",
    },
    {
      firstName: "Yuval Noah",
      lastName: "Harari",
    },
  ];
}

function getBooks(): Array<Book> {
  return [
    {
      title: "Sapiens",
      isFiction: false,
      datePuplished: new Date(),
    },
    {
      title: "Homo Deus",
      isFiction: false,
      datePuplished: new Date(),
    },
    {
      title: "Once Upon a Golden Dawn",
      isFiction: true,
      datePuplished: new Date(),
    },
  ];
}
