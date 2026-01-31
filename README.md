# Portfolio Platform

A full-stack portfolio platform with an integrated AI-powered Personality Miner tool.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Lucia v3 with Argon2 password hashing
- **Encryption**: AES-256-GCM for user data at rest
- **LLM**: Llama 3.1:8B via Ollama (local) or vLLM (production)
- **Monorepo**: Turborepo + pnpm workspaces

## Project Structure

```
portfolio-platform/
├── apps/
│   └── web/              # Next.js frontend + API
├── packages/
│   ├── db/               # Drizzle schema & database client
│   ├── crypto/           # AES-256-GCM encryption utilities
│   └── pm-core/          # Personality Miner core logic & prompts
├── training/             # ML training pipeline (Python)
├── docker-compose.yml    # Local Postgres + Ollama
└── turbo.json           # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Setup

1. **Clone and install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start local services**:
   ```bash
   docker compose up -d
   ```

3. **Set up environment**:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. **Run database migrations**:
   ```bash
   pnpm db:push
   ```

5. **Pull Llama model** (optional, for AI features):
   ```bash
   docker exec -it portfolio-ollama ollama pull llama3.1:8b
   ```

6. **Start development server**:
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run tests |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |

## Security

- All Personality Miner data is encrypted with AES-256-GCM
- Per-user encryption keys derived from password + unique salt
- Keys are never stored; derived at runtime
- HTTPS enforced in production
- Rate limiting on LLM endpoints

## License

Private - All rights reserved

