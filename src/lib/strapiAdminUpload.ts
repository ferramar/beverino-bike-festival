// Upload di un singolo file su Strapi (plugin Upload) usando un token server-side.
// Condiviso dalle route di scrittura sotto /api/admin che gestiscono un'immagine (es. logo sponsor).

export const MAX_ADMIN_IMAGE_BYTES = 15 * 1024 * 1024; // sotto i 20MB del plugin upload Strapi

export class StrapiUploadError extends Error {}

export async function uploadImageToStrapi(
  file: File,
  strapiUrl: string,
  apiToken: string
): Promise<number> {
  if (!file.type.startsWith('image/') || file.size > MAX_ADMIN_IMAGE_BYTES) {
    throw new StrapiUploadError(`File non valido: ${file.name}`);
  }

  const formData = new FormData();
  formData.append('files', file, file.name);

  const res = await fetch(`${strapiUrl}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}` },
    body: formData,
  });

  if (!res.ok) {
    const details = await res.text();
    throw new StrapiUploadError(`Upload su Strapi fallito: ${details}`);
  }

  const uploaded: Array<{ id: number }> = await res.json();
  return uploaded[0].id;
}
