import 'dotenv/config';
import { app } from './app.js';

// Deliberately not named PORT: some hosting/preview harnesses inject a PORT
// env var for "the" web process, which would collide with the client's dev
// server when both run under one `npm run dev`.
const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3001;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
