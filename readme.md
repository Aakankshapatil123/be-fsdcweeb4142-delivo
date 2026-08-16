# Food Delivery Platform

Create a food delivery platform with features for restaurant listings, menu browsing, and order tracking. Implement tools for secure payments, delivery scheduling, and customer feedback to provide a seamless food delivery experience.


# Backend

The backend of **Delivo** is developed using Node.js, Express.js, MongoDB, and Mongoose. It provides RESTful APIs for authentication, restaurants, menus, orders, reviews, notifications, user profiles, admin management, and payments.

# Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Razorpay
- Cookie-based Authentication

# Backend Features

- User Registration and Login
- JWT-based Authentication
- Role-based Authorization
- User Profile Management
- Restaurant Management
- Restaurant Owner Management
- Menu Management
- Food Ordering
- Order Status Management
- Order Tracking
- Reviews and Ratings
- Notifications
- Admin Dashboard
- User and Restaurant Management
- Razorpay Payment Integration
- Image Upload using Multer

# User Roles

The application supports three roles:

- User – Browse restaurants, view menus, place orders, make payments, and submit reviews.
- Restaurant Owner – Manage restaurant profile, menu items, and customer orders.
- Admin – Manage users, restaurants, orders, reviews, and overall application data.


### Running the Backend

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

For development:

```bash
npm run dev
```

The backend server runs on:

```text
http://localhost:3001
```

# API

The backend exposes REST APIs for:

* Authentication
* Users
* Restaurants
* Restaurant Owners
* Menus
* Orders
* Reviews
* Notifications
* Payments
* Admin Management

All protected APIs use authentication and role-based authorization where required.





```json

 {
  "name": "Pizza Palace",
  "description": "Serving freshly baked pizzas, pasta, garlic bread, and refreshing beverages made with premium ingredients.",
  "cuisine": "Italian",
  "location": {
    "address": "FC Road, Shivajinagar",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411005"
  },
  "openingHours": "10:00 AM - 11:00 PM",
  "image": "https://example.com/images/pizza-palace.jpg",
  "priceRange": "₹₹₹"
}

 {
    "name": "Burger House",
    "description": "A perfect destination for juicy burgers, crispy fries, wraps, and refreshing soft drinks.",
    "cuisine": "Fast Food",
    "location": {
      "address": "MG Road, Camp",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "openingHours": "11:00 AM - 11:30 PM",
    "image": "https://example.com/images/burger-house.jpg",
    "priceRange": "₹₹"
  },

  {
    "name": "Biryani Express",
    "description": "Authentic Hyderabadi biryani, kebabs, curries, and delicious Indian meals prepared with traditional spices.",
    "cuisine": "Indian",
    "location": {
      "address": "Baner Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411045"
    },
    "openingHours": "12:00 PM - 11:00 PM",
    "image": "https://example.com/images/biryani-express.jpg",
    "priceRange": "₹₹₹"
  },
  {
    "name": "Chinese Wok",
    "description": "Enjoy authentic Chinese cuisine including noodles, fried rice, momos, soups, and stir-fried dishes.",
    "cuisine": "Chinese",
    "location": {
      "address": "Koregaon Park",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "openingHours": "11:00 AM - 10:30 PM",
    "image": "https://example.com/images/chinese-wok.jpg",
    "priceRange": "₹₹"
  },
  
  {
    "name": "Green Bowl",
    "description": "Healthy meals with fresh salads, smoothie bowls, wraps, sandwiches, and nutritious beverages.",
    "cuisine": "Healthy Food",
    "location": {
      "address": "Hinjewadi Phase 1",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411057"
    },
    "openingHours": "09:00 AM - 09:00 PM",
    "image": "https://example.com/images/green-bowl.jpg",
    "priceRange": "₹₹"
  }

```

