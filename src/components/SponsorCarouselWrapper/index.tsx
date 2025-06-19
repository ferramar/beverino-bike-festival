// components/SponsorsCarouselWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import SponsorsCarousel, { SponsorsCarouselSkeleton } from './SponsorCarousel';
import { getAllSponsors } from '../../utils/api';
import { SponsorItem } from '../../types/sponsor';

export default function SponsorsCarouselWrapper() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const data = await getAllSponsors();
        setSponsors(data);
      } catch (error) {
        console.error('Error loading sponsors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsors();
  }, []);

  if (loading) {
    return <SponsorsCarouselSkeleton />;
  }

  if (sponsors.length === 0) {
    return null;
  }

  return <SponsorsCarousel sponsors={sponsors} speed={30} />;
}