# Viek_Game
## Richard's Stack
- HTML
- CSS
- JavaScript
- Currently learning: Next.js, Tailwind CSS

## Backend API & Monorepo Setup

The backend code for this project is located in the `viektech-play` directory. 

To set up the API and Database:

1. Navigate to the working directory:
   ```bash
   cd viektech-play
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Copy `.env.example` to `.env` inside `viektech-play/apps/api/`
   - Update `DATABASE_URL`, `JWT_SECRET`, and `PAYSTACK_SECRET_KEY` with your credentials.

4. Setup Database & Prisma:
   ```bash
   cd apps/api
   npx prisma migrate dev
   ```

5. Run the API:
   ```bash
   npm run dev:api
   ```

Please see [viektech-play/README.md](./viektech-play/README.md) for full detailed documentation on the monorepo architecture and modules.

