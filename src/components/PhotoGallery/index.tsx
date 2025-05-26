/* eslint-disable */
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Grid,
  Card,
  CardActionArea
} from '@mui/material';
import Image from 'next/image';

const Lightgallery = dynamic(
  () => import('lightgallery/react').then(mod => mod.default),
  { ssr: false }
);
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';


export type PhotoItem = { src: string; thumb: string };

export const PhotoGallery: React.FC<{ items: PhotoItem[] }> = ({ items }) => {
  const lg = useRef<any>(null);

  const onInit: any = (detail: any) => { lg.current = detail.instance; };

  return (
    <>
      <Grid container spacing={2}>
        {items.map((item, idx) => (
          <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={idx}>
            <Card>
              <CardActionArea onClick={() => lg.current.openGallery(idx)}>
                <Box position="relative" width="100%" height={200}>
                  <Image src={item.thumb} alt="" fill style={{ objectFit: 'cover' }} />
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Lightgallery
        onInit={onInit}
        dynamic
        download={false}
        plugins={[lgZoom, lgThumbnail]}
        dynamicEl={items.map(i => ({ src: i.src, thumb: i.thumb }))}
      />
    </>
  );
};