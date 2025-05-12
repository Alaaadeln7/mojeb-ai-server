import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: `
A full-featured E-commerce REST API built with modern technologies and best practices.

🛠 Technologies Used:
- Node.js & Express.js: Fast, unopinionated web framework
- MongoDB & Mongoose: Robust database solution with elegant ODM
- JWT Authentication: Secure user authentication and authorization
- Swagger/OpenAPI: API documentation and testing
- bcrypt: Secure password hashing
- Express Middleware: Custom middleware for authentication and error handling

🔑 Key Features:
1. User Management:
   - User registration and authentication
   - JWT-based authorization
   - Profile management
   - Role-based access control (Admin/User)

2. Product Management:
   - CRUD operations for products
   - Product categories
   - Product search and filtering
   - Image upload and management

3. Shopping Cart:
   - Add/remove items
   - Update quantities
   - Calculate totals
   - Save for later

4. Order Management:
   - Create orders
   - Order history
   - Order status tracking
   - Admin order management

5. Payment Processing:
   - Secure Stripe integration
   - Multiple payment methods
   - Payment status tracking
   - Refund handling

6. Review System:
   - Product reviews and ratings
   - User review management
   - Average rating calculation

7. Discount System:
   - Coupon code management
   - Percentage-based discounts
   - Expiry date handling
   - Usage tracking

8. Security Features:
   - Password hashing
   - JWT token authentication
   - Protected routes
   - Input validation

9. Admin Features:
   - User management
   - Order management
   - Product management
   - Analytics and reporting

This API follows REST principles and uses standard HTTP methods and status codes. All responses are in JSON format.
      `,
      contact: {
        name: "API Support",
        email: "support@e-commerce-api.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
    ],
  },
  apis: ["./docs/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
