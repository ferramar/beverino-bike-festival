// hooks/useCloudinaryVideo.ts
import { useMemo } from 'react';

interface CloudinaryVideoOptions {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function useCloudinaryVideo(publicId: string, options: CloudinaryVideoOptions = {}) {
  const videoUrl = useMemo(() => {
    if (!publicId) return '';
    
    const cloudName = publicId.includes('cloudinary.com') 
      ? publicId.split('/')[3] 
      : 'your-cloud-name';
      
    const id = publicId.includes('cloudinary.com')
      ? publicId.split('/upload/')[1]
      : publicId;

    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality || 'auto'}`);
    
    // Ottimizzazioni video
    transformations.push('vc_auto'); // Video codec automatico
    transformations.push('f_auto'); // Formato automatico
    
    const transformation = transformations.join(',');
    
    return `https://res.cloudinary.com/${cloudName}/video/upload/${transformation}/${id}`;
  }, [publicId, options]);

  // Genera thumbnail del video
  const thumbnailUrl = useMemo(() => {
    if (!publicId) return '';
    
    const cloudName = publicId.includes('cloudinary.com') 
      ? publicId.split('/')[3] 
      : 'your-cloud-name';
      
    const id = publicId.includes('cloudinary.com')
      ? publicId.split('/upload/')[1].replace(/\.[^/.]+$/, '') // Rimuovi estensione
      : publicId.replace(/\.[^/.]+$/, '');

    // Trasformazioni per thumbnail
    const transformations = [
      'so_auto', // Start offset automatico (frame interessante)
      'w_800',
      'h_450',
      'c_fill',
      'g_auto',
      'q_auto',
      'f_auto'
    ].join(',');
    
    return `https://res.cloudinary.com/${cloudName}/video/upload/${transformations}/${id}.jpg`;
  }, [publicId]);

  return {
    videoUrl,
    thumbnailUrl,
    poster: thumbnailUrl,
  };
}