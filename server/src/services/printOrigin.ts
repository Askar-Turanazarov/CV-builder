// Where headless Chrome opens the print pages, and the public base URL of
// this deployment. On Vercel it's this same deployment (env vars set by the
// platform, never from request headers); locally it's the Vite dev server.
export function printOrigin(): string {
  const host =
    process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  if (host) return `https://${host}`;
  return process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
}
