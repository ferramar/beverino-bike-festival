// src/types/leaflet-gpx.d.ts
declare module 'leaflet-gpx' {
  import * as L from 'leaflet';
  
  interface GPXOptions {
    async?: boolean;
    marker_options?: {
      startIconUrl?: string;
      endIconUrl?: string;
      shadowUrl?: string;
      wptIconUrls?: { [key: string]: string };
    };
    polyline_options?: L.PolylineOptions;
  }

  class GPX extends L.FeatureGroup {
    constructor(gpx: string | Document, options?: GPXOptions);
    get_distance(): number;
    get_elevation_gain(): number;
    get_elevation_loss(): number;
  }

  namespace L {
    class GPX extends GPX {}
  }
}