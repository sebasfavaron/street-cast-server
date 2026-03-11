const DEFAULT_LOCAL_APP_URL = 'http://localhost:3050';

export function resolveAppUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return DEFAULT_LOCAL_APP_URL;
}
