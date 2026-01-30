# Castle

A house data management app organized by rooms with three fixed categories: Manuals, Appliances, and Maintenance.

## Features

- **Rooms**: Organize your home by rooms (bedroom, kitchen, garage, etc.)
- **Manuals**: Upload and store PDF manuals for easy access
- **Appliances**: Track appliances with warranty dates and serial numbers
- **Maintenance**: Schedule recurring maintenance tasks with due date tracking

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite with Drizzle ORM
- **Deployment**: Docker + Docker Compose

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Production (Docker)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t castle .
docker run -p 8080:8080 -v castle-data:/app/data castle
```

## Project Structure

```
castle/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── layout/    # Layout components
│   │   ├── rooms/     # Room components
│   │   ├── manuals/   # Manual components
│   │   ├── appliances/# Appliance components
│   │   └── maintenance/# Maintenance components
│   ├── db/            # Database schema and connection
│   ├── lib/           # Utility functions
│   ├── actions/       # Server actions
│   └── types/         # TypeScript types
├── data/              # SQLite database and uploads (Docker volume)
├── Dockerfile
└── docker-compose.yml
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
DATABASE_PATH=./data/castle.db
UPLOADS_PATH=./data/uploads
```

## License

MIT
