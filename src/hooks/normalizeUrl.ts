export const normalizeUrl = (url: string): string => {
	if (!url) return '';

	// Rimuovi spazi bianchi
	const cleanUrl = url.trim();

	// Se inizia già con protocollo, restituiscilo così com'è
	if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
		return cleanUrl;
	}

	// Se inizia con www., aggiungi https://
	if (cleanUrl.startsWith('www.')) {
		return `https://${cleanUrl}`;
	}

	// Altrimenti aggiungi https:// (assumendo che sia un dominio)
	return `https://${cleanUrl}`;
};