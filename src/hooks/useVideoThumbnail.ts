"use client"
import { useState, useEffect } from 'react';

/**
 * Extracts a thumbnail dataURL from a video at the given seekTime (seconds).
 */
export function useVideoThumbnail(url: string, seekTime = 1): string | null {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    const capture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setThumb(canvas.toDataURL('image/jpeg'));
      }
    };

    video.addEventListener('loadeddata', () => {
      video.currentTime = seekTime;
    });
    video.addEventListener('seeked', capture);

    return () => {
      video.removeEventListener('loadeddata', () => {});
      video.removeEventListener('seeked', capture);
      video.src = '';
    };
  }, [url, seekTime]);

  return thumb;
}