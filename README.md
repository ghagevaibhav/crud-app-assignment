# CRUD Platform with Credit System

A Next.js-based CRUD platform with user authentication, API key management, and a credit-based system for data operations.

## Features

- **User Authentication**: Secure sign-in and sign-up functionality
- **API Key Management**: Each user gets unique API credentials
- **Credit System**: Users start with 4 credits and can request one recharge
- **Data Management**: Create, read, update, and delete data entries
- **Credit Tracking**: Monitor credit usage and recharge status

## Tech Stack

- **Frontend**: Next.js 15.3.1, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS

## Prerequisites

- Node.js (v18 or higher)
- Docker (for local PostgreSQL)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crud-platform
   ```

2. Set up the database (choose one option):

   ### Option 1: Local PostgreSQL with Docker
   ```bash
   # Start PostgreSQL container
   docker run --name crud-platform-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=crud_platform \
     -p 5432:5432 \
     -d postgres:latest

   # Stop the container when needed
   docker stop crud-platform-db
   docker rm crud-platform-db
   ```

   ### Option 2: Neon Database (Free Tier)
   1. Sign up at [Neon](https://neon.tech)
   2. Create a new project
   3. Copy the connection string from the dashboard
   4. Replace the DATABASE_URL in your .env file

   ### Option 3: Supabase Database (Free Tier)
   1. Sign up at [Supabase](https://supabase.com)
   2. Create a new project
   3. Get the connection string from Settings > Database
   4. Replace the DATABASE_URL in your .env file

3. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Initialize the database:
   ```bash
   npm run init-db
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Usage

### User Registration and Authentication

1. Navigate to `/auth/signup` to create a new account
2. After registration, you'll receive:
   - API Key
   - API URL
   - 4 initial credits

### Credit System

- Users start with 4 credits
- Each data operation (create/update/delete) costs 1 credit
- Users can request one recharge (4 additional credits) via email
- To simulate a recharge request:
  ```bash
  node scripts/simulate-recharge.js user@example.com
  ```

### API Usage

All API endpoints require authentication using the API credentials:

```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "x-api-url: YOUR_API_URL" \
  -d '{"title": "Test Data", "content": "Test Content"}'
```

Available API endpoints:
- `POST /api/data` - Create new data entry
- `GET /api/data` - List all data entries
- `PUT /api/data/:id` - Update data entry
- `DELETE /api/data/:id` - Delete data entry
- `POST /api/recharge` - Request credit recharge

### Testing

The project includes several test scripts:

1. Create a test user:
   ```bash
   node scripts/create-test-user.js
   ```

2. Test API endpoints:
   ```bash
   node scripts/test-api.js
   ```

3. Test the application:
   ```bash
   node scripts/test-application.js
   ```

4. Simulate credit recharge:
   ```bash
   node scripts/simulate-recharge.js user@example.com
   ```

## Project Structure

```
crud-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Main application page
├── prisma/                # Prisma schema and migrations
├── scripts/               # Utility scripts
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Development

### Database Migrations

To create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

To apply migrations:
```bash
npx prisma migrate deploy
```

### Adding New Features

1. Create new API routes in `app/api/`
2. Update Prisma schema in `prisma/schema.prisma`
3. Run migrations
4. Update frontend components in `app/`

## License

[Your License]

## Contributing

[Your Contributing Guidelines]
