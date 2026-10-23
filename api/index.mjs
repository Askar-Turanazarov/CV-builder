// Vercel serverless entry: the compiled Express app (built by `npm run build`).
// Env vars come from the Vercel project settings, so no dotenv here.
import { app } from '../server/dist/app.js';

export default app;
