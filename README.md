# Mojeb AI Server

A Node.js server application providing AI-powered chatbot and voice services.

## Features

- Authentication system
- Chatbot integration
- Voice call handling
- Plan management
- Client management
- Real-time communication via WebSocket

## Prerequisites

- Node.js >= 18.x
- MongoDB
- Google Cloud Account (for Speech-to-Text and Text-to-Speech)
- Twilio Account

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=your_mongodb_url
   SECRET_KEY_SESSION=your_secure_session_key
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLOUD_KEY=your_google_cloud_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Testing

```bash
npm test
```

## Security Features

- Helmet for HTTP headers security
- Rate limiting
- Session management with MongoDB
- CSRF protection
- XSS protection
- Input validation with Yup

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License
