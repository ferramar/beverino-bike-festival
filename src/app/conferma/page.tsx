// app/conferma/page.js (o page.tsx se usi TypeScript)
import { Suspense } from 'react';
import Conferma from './Conferma';

// Loading component mentre si carica la pagina
function LoadingConferma() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>Caricamento...</div>
      </div>
    </div>
  );
}

// Wrapper page component
export default function ConfermaPage() {
  return (
    <Suspense fallback={<LoadingConferma />}>
      <Conferma />
    </Suspense>
  );
}