// src/utils/strapi.ts

import axios from 'axios';

const strapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default strapi;
