# CRUD Platform

A web application that provides a CRUD API with credit-based access control. Users can authenticate using Google and receive API credentials for making requests.

## Features

- Google Authentication
- API Key and URL generation
- Credit-based API access
- One-time credit recharge via email
- CRUD operations for data management

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crud_platform"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ADMIN_EMAIL="admin@example.com"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Usage

### Authentication

All API requests require the following headers:
- `x-api-key`: Your API key
- `x-api-url`: Your API URL

### Endpoints

#### Data Operations

- `GET /api/data` - Get all data
- `POST /api/data` - Create new data
  ```json
  {
    "title": "Example Title",
    "content": "Example Content"
  }
  ```
- `GET /api/data/[id]` - Get specific data
- `PUT /api/data/[id]` - Update data
  ```json
  {
    "title": "Updated Title",
    "content": "Updated Content"
  }
  ```
- `DELETE /api/data/[id]` - Delete data

### Credit System

- Each user starts with 4 credits
- Each API request consumes 1 credit
- When credits are exhausted, users can request a recharge by emailing the admin
- Users can only recharge once

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid credentials)
- 403: Forbidden (insufficient credits)
- 404: Not Found
- 500: Internal Server Error

## Development

- Frontend: Next.js with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js
- Styling: Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
