RESTful API: SQL Library

Acknowledgment

This project is part of the Treehouse Full Stack JavaScript program. It demonstrates how to build a simple RESTful API using Node.js and Express with SQLite for data storage.


Overview

This project demonstrates a simple RESTful API built with Node.js and Express, utilizing an SQLite database for managing a library of books. The API allows users to create, retrieve, update, and delete book records. Authentication is handled using basic authentication, and Postman is used for testing the API routes during development.

The API follows standard RESTful principles, where HTTP methods (GET, POST, PUT, DELETE) are used to interact with the resources (books).

Features

Node.js and Express for building a RESTful API.
SQLite for database management (storing book records).
Basic Authentication for user access to the API.
Postman for testing and interacting with the API.
CRUD operations (Create, Read, Update, Delete) for managing books.

Tech Stack

Node.js: JavaScript runtime for building the API.
Express: Web framework for Node.js to create RESTful routes.
SQLite: Database used to store book information.
Postman: API testing tool for development and validation.
Basic Authentication: For securing routes and protecting the API.

API Endpoints

POST /api/users/signup: Create a new user (sign up)

Body: { username, password }
POST /api/users/signin: Sign in a user (get a token)

Body: { username, password }
Response: Returns an authentication token if the credentials are correct.
GET /api/books: Retrieve all books

Response: List of all books in the library.
POST /api/books: Add a new book to the library

Body: { title, author, genre, year }
PUT /api/books/:id: Update a book's details

Params: id of the book to update.
Body: { title, author, genre, year }
DELETE /api/books/:id: Delete a book from the library

Params: id of the book to delete.

Authentication

The API uses basic authentication for securing access to certain routes, such as creating, updating, and deleting books. A user must sign up and sign in to receive a token, which must then be passed in the Authorization header when making requests to the protected routes.

Basic Authentication requires the user to include their username and password in the request header. After successful login, the server issues an authentication token that can be used to access restricted routes.
