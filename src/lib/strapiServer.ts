import 'server-only';

/**
 * Accesso a Strapi dal server con il token API dedicato.
 *
 * Tutte le operazioni sulle iscrizioni (dati personali) e sugli upload passano da qui:
 * in questo modo il ruolo Public di Strapi non ha bisogno di alcun permesso su
 * `iscrizioni` né su `upload`.
 */
export function getStrapiUrl(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

export function strapiAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = process.env.STRAPI_API_TOKEN;
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
}
