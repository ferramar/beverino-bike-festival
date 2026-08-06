// Compressione/resize immagini lato client via Canvas, nessuna dipendenza esterna.
// Riduce il peso delle foto prima dell'upload (limiti body Vercel, velocità galleria).

export class UnsupportedImageError extends Error {
  constructor(fileName: string) {
    super(`Formato immagine non supportato dal browser: ${fileName}`);
    this.name = 'UnsupportedImageError';
  }
}

export type CompressedImageResult = {
  blob: Blob;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
};

const DEFAULT_MAX_DIMENSION = 2000;
const DEFAULT_QUALITY = 0.85;

function toJpegFileName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}.jpg`;
}

export async function compressImageFile(
  file: File,
  opts?: { maxDimension?: number; quality?: number }
): Promise<CompressedImageResult> {
  const maxDimension = opts?.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = opts?.quality ?? DEFAULT_QUALITY;

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = objectUrl;

    try {
      await img.decode();
    } catch {
      throw new UnsupportedImageError(file.name);
    }

    const { naturalWidth: width, naturalHeight: height } = img;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetWidth = Math.round(width * scale);
    const targetHeight = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new UnsupportedImageError(file.name);
    }

    // Sfondo bianco: evita artefatti neri quando un PNG con trasparenza viene convertito in JPEG
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const blob: Blob | null = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob || blob.size >= file.size) {
      // Fallback: se la compressione non ha aiutato (o è fallita), usa il file originale
      return {
        blob: file,
        fileName: file.name,
        originalSize: file.size,
        compressedSize: file.size,
        width,
        height,
      };
    }

    return {
      blob,
      fileName: toJpegFileName(file.name),
      originalSize: file.size,
      compressedSize: blob.size,
      width: targetWidth,
      height: targetHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
