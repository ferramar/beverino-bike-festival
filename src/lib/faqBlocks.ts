import type { StrapiBlock } from '@/types/faq';

// Converte tra il formato Blocks di Strapi e una semplice textarea:
// un paragrafo per blocco, separati da una riga vuota. Formattazioni
// (grassetto, liste, titoli) non sono editabili qui e vengono appiattite
// in testo semplice se una risposta esistente le usa.

type FaqParagraphBlock = { type: 'paragraph'; children: Array<{ type: 'text'; text: string }> };

export function blocksToPlainText(blocks: StrapiBlock[] | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map((block) => (block.children || []).map((c) => c.text).join(''))
    .join('\n\n');
}

export function plainTextToBlocks(text: string): FaqParagraphBlock[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }];
  }

  return paragraphs.map((p) => ({ type: 'paragraph', children: [{ type: 'text', text: p }] }));
}
