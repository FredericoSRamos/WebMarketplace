# Marketplace Web Application

This is a web-based marketplace application developed as part of a Web Software Programming course. The project allows users to browse products, make purchases and sell items. It incorporates authentication mechanisms to ensure secure access to features. The platform is built using modern web technologies, with a frontend developed in React.js, a backend built with Node.js and Express, and MongoDB for the database.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Authentication](#authentication)
- [Usage](#usage)

## Technologies Used
- **Frontend:**
  - React.js for building the user interface.
  - Redux for state management and slices.

- **Backend:**
  - Node.js for the server-side runtime.
  - Express.js for building the RESTful API.
  - JWT (JSON Web Tokens) for user authentication and authorization, ensuring that only authenticated users can access certain features.

- **Database:**
  - MongoDB as the database for storing user and product data.

## Features
- **User Authentication:**
  - User login and registration via JWT-based authentication.
  - Secure token management and token-based access control.

- **Marketplace Functionality:**
  - Browse and search for products in various categories.
  - Add products to the shopping cart and make purchases.

- **User Reviews:**
  - Users can leave reviews and ratings for products they have purchased.
  - Reviews include text comments and a rating system.

- **State Management:**
  - Redux is used for managing the application's state, including user authentication status, products and reviews.

- **Admin Functionality:**
  - Admin users have the ability to manage products (add, update, delete).

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone the repository to your local machine:

   git clone https://github.com/FredericoSRamos/WebMarketplace.git
   cd WebMarketplace

2. Install dependencies for both the frontend and backend:

- For the frontend:
   cd FrontEnd
   npm install

- For the backend:
   cd BackEnd
   npm install


3. Update the config.js file wih your mongodb url

4. Lastly, start both the frontend and backend with npm start

The application should now be accessible at http://localhost:3000

## Authentication

- **JWT Tokens**: During the login process, users receive a JWT token. This token is sent with every subsequent request to authenticate the user.
- **Protected Routes**: Certain API routes and frontend pages require authentication. If a user is not logged in, they will be redirected to the login page or shown an error message.

## Usage

- After registering or logging in, you can browse through the marketplace and view various products.
- Users can leave reviews and ratings for users they have purchased products.
- Admins have additional features such as managing users.