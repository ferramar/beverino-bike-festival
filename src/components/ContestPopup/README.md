# ContestPopup - Pop-up Concorso Damiani Ottica

## 📱 Ottimizzazioni Mobile

Il pop-up è stato completamente ottimizzato per dispositivi mobili, considerando che l'85% degli utenti visita il sito da mobile.

### 🎯 Caratteristiche Mobile

#### Layout Responsive
- **Altezza massima**: Il pop-up ha un'altezza massima del 90vh su tutti i dispositivi
- **Contenuto scrollabile**: Il contenuto del pop-up è scrollabile quando supera l'altezza disponibile
- **Bordi arrotondati**: Mantenuti su tutti i dispositivi per un aspetto moderno
- **Margini adattivi**: Margini ridotti su mobile (1rem) per massimizzare lo spazio

#### Spaziature Ottimizzate
- **Padding ridotto**: `p: { xs: 2, sm: 4 }` per contenuto più compatto
- **Spacing adattivo**: `spacing={{ xs: 2, sm: 3 }}` per Stack
- **Margini ridotti**: Tutti i margini sono ridotti su mobile

#### Tipografia Mobile-First
- **Font size responsive**: 
  - Titoli: `{ xs: '1.25rem', sm: '1.5rem' }`
  - Sottotitoli: `{ xs: '1.1rem', sm: '1.25rem' }`
  - Testo: `{ xs: '0.9rem', sm: '1rem' }`
  - Caption: `{ xs: '0.7rem', sm: '0.75rem' }`

#### Immagini e Icone
- **Anteprima occhiali**: `{ xs: 160x100, sm: 200x120 }`
- **Icone ridotte**: `{ xs: 20px, sm: 24px }`
- **Logo responsive**: Dimensioni adattive con `maxWidth: '100%'`

#### Pulsanti e Interazioni
- **Pulsante CTA**: Larghezza 100% su mobile per facilità di tocco
- **Pulsante chiudi**: Dimensioni ridotte `{ xs: 32px, sm: 40px }`
- **Touch-friendly**: Tutti gli elementi hanno dimensioni minime di 44px per il tocco

#### Step Lista
- **Numeri ridotti**: `{ xs: 20px, sm: 24px }`
- **Gap ridotto**: `{ xs: 1.5, sm: 2 }`
- **Font size**: `{ xs: '0.8rem', sm: '0.875rem' }`

### 🔧 Funzionalità Tecniche

#### localStorage Gestito
- **Hook personalizzato**: `useLocalStorage` per gestire l'idratazione SSR
- **Prevenzione errori**: Gestione sicura del localStorage
- **Reset automatico**: Possibilità di resettare lo stato per test

#### Gestione Scroll
- **Body scroll bloccato**: Quando il pop-up è aperto, lo scroll del body è disabilitato
- **Touch action**: Previene anche il touchmove su dispositivi mobili
- **Scroll interno**: Il contenuto del pop-up è scrollabile con scrollbar personalizzata
- **Cleanup automatico**: Ripristina lo scroll quando il pop-up viene chiuso


#### Animazioni
- **Framer Motion**: Animazioni fluide e performanti
- **AnimatePresence**: Gestione corretta dell'entrata/uscita
- **Transizioni ottimizzate**: Durata ridotta per mobile

### 📊 Breakpoints Utilizzati

```typescript
// Material-UI Breakpoints
xs: 0px      // Mobile
sm: 600px    // Tablet
md: 900px    // Desktop
lg: 1200px   // Large Desktop
xl: 1536px   // Extra Large
```

### 🎨 Design System

#### Colori
- **Primary**: `#A52D0C` (arancione brand)
- **Secondary**: `#FB6616` (arancione chiaro)
- **Background**: Gradiente bianco/grigio chiaro
- **Text**: Scala di grigi per leggibilità

#### Ombre e Effetti
- **Box Shadow**: `0 20px 60px rgba(0,0,0,0.15)`
- **Backdrop**: `rgba(0, 0, 0, 0.7)` con blur
- **Hover Effects**: Transform e shadow per interattività

### 🚀 Performance

#### Ottimizzazioni
- **Lazy Loading**: Immagini caricate solo quando necessario
- **Memoization**: Componenti ottimizzati per re-render
- **Bundle Size**: Import selettivi di Material-UI

#### Accessibilità
- **ARIA Labels**: Tutti i pulsanti hanno etichette descrittive
- **Focus Management**: Navigazione da tastiera supportata con focus automatico
- **Screen Reader**: Contenuto accessibile per assistive technology
- **Backdrop click**: Chiusura del pop-up cliccando fuori dal contenuto
- **Escape key**: Chiusura con tasto ESC supportata

### 📱 Test Mobile

Per testare il pop-up su mobile:

1. **DevTools**: Apri Chrome DevTools → Toggle device toolbar
2. **LocalStorage**: Controlla `beverino-contest-popup-seen` nel localStorage
3. **Responsive**: Testa su diverse dimensioni di schermo
4. **Reset**: Cancella il localStorage per testare nuovamente il pop-up

### 🔄 Aggiornamenti Futuri

- [ ] Aggiungere supporto per preferenze utente (dark mode)
- [ ] Implementare analytics per tracking conversioni
- [ ] Aggiungere A/B testing per diverse versioni del pop-up
- [ ] Supporto per multiple lingue
