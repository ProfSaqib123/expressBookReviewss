const express = require('express');
let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const getBooksAsync = async () => {
  try {
    // Directly return the books object
    return books;
  } catch (error) {
    throw error;
  }
};
public_users.get('/', async (req, res) => {
//   try {
//     const bookList = await getBooksAsync();
//     return res.status(200).json(bookList);
//   } catch (error) {
//     console.error('Error fetching books:', error.message);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
try {
  const bookList = await getBooksAsync();
  return res.status(200).json(bookList);
} catch (error) {
  console.error('Error fetching books:', error.message);
  return res.status(500).json({ message: 'Internal Server Error' });
}
});


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = Object.values(books); // Convert the books object into an array of book values
  return res.status(200).json(bookList);
  return res.status(300).json({message: " implemented"});
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
//   return res.status(300).json({message: "Yet to be implemented"});
//  });





// public_users.get('/isbn/:isbn', async function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

//task11
function searchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error('Book not found'));
    }
  });
}

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  searchBookByISBN(isbn)
    .then((bookDetails) => {
      return res.status(200).json(bookDetails);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'Book not found' });
    });
});









// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const authorToSearch = req.params.author;
//   const matchingBooks = [];

//   for (const isbn in books) {
//     if (books.hasOwnProperty(isbn) && books[isbn].author === authorToSearch) {
//       matchingBooks.push(books[isbn]);
//     }
//   }

//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "No books found for the provided author" });
//   }
//   // return res.status(300).json({message: "Yet to be implemented"});
// });
function searchBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn) && books[isbn].author === author) {
        matchingBooks.push(books[isbn]);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error('No books found for the provided author'));
    }
  });
}

public_users.get('/author/:author', function (req, res) {
  const authorToSearch = req.params.author;
  searchBookByAuthor(authorToSearch)
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: 'No books found for the provided author' });
    });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleToSearch = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books.hasOwnProperty(isbn) && books[isbn].title === titleToSearch) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for the provided title" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});
// public_users.get('/title/:title', function (req, res) {
//   console.log('Handling Title request');
//   const titleToSearch = req.params.title;
//   console.log('Title:', titleToSearch);

//   // Use Axios to make a GET request to the book service
//   axios.get(`http://localhost:8000/title/${encodeURIComponent(titleToSearch)}`)
//     .then(response => {
//       const matchingBooks = response.data;

//       if (matchingBooks.length > 0) {
//         res.status(200).json(matchingBooks);
//       } else {
//         res.status(404).json({ message: "No books found for the provided title" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ message: "Internal Server Error" });
//     });
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnToSearch = req.params.isbn;
  if (books[isbnToSearch]) {
    const reviews = books[isbnToSearch].reviews;
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});



//DELTE
public_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.user?.username; // Assuming you have set the session username during authentication
  const isbn = req.params.isbn;
  console.log("User in session:", req.session.user);
  console.log("ISBN:", isbn);
  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = books[isbn].reviews;

  // Filter reviews for the given user
  const userReviews = Object.keys(reviews).filter((user) => user === username);

  if (userReviews.length === 0) {
    return res.status(404).json({ message: "Review not found for the given user and ISBN" });
  }

  // Delete the reviews for the given user
  userReviews.forEach((user) => {
    delete reviews[user];
  });

  return res.status(200).json({ message: "Review deleted successfully" });
});

//put modify
public_users.put("/auth/review/:isbn", (req, res) => {
  ///Write your code here
  const { isbn } = req.params;
  const { review } = req.query;
  const { user } = req.session; // Use req.session.user if that's how it's stored
  console.log("User in session:", req.session.user);
  console.log("ISBN:", isbn);
  console.log("review:", review);
  if (!isbn || !review || !user || !user.username) {
    return res.status(400).json({ message: "ISBN, review, and username are required" });
  }

  const { username } = user;

  // Check if the book with the given ISBN exists
  if (books.hasOwnProperty(isbn)) {
    // Check if the user has already posted a review for this ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Modify the existing review for the same user and ISBN
      books[isbn].reviews[username] = review;
    } else {
      // Add a new review for a different user and/or ISBN
      books[isbn].reviews[username] = review;
    }

    return res.status(200).json({ message: "Review added or modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN" });
  }
});

module.exports.general = public_users;
