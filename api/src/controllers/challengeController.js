import {
    redactText,
    generateUnredactKey,
    storeUnredactMapping,
    unredactText,
} from '../services/redactionService.js';

// Implementa Part 1 del challenge: redactar terminos indicados dentro del texto.
export async function redactChallengeText(req, res) {
    try {
        const { censoredTerms, documentText, key } = req.body;

        if (typeof censoredTerms !== 'string' || typeof documentText !== 'string') {
            return res.status(400).json({
                error: 'censoredTerms and documentText must be strings',
            });
        }

        if (key !== undefined && typeof key !== 'string') {
            return res.status(400).json({ error: 'key must be a string when provided' });
        }

        const { redactedText, parsedTerms } = redactText(documentText, censoredTerms, 'XXXX');
        const effectiveKey = key?.trim() || generateUnredactKey();

        storeUnredactMapping(effectiveKey, redactedText, documentText);

        return res.status(200).json({
            redactedText,
            parsedTerms,
            key: effectiveKey,
        });
    } catch (error) {
        console.error('[challenge] redact failed:', error);
        return res.status(500).json({ error: 'Failed to redact text' });
    }
}

// Implementa Part 2 del challenge: recuperar texto original con key + texto redactado.
export async function unredactChallengeText(req, res) {
    try {
        const { key, documentText, redactedText } = req.body;
        const textToUnredact = redactedText ?? documentText;

        if (typeof key !== 'string' || typeof textToUnredact !== 'string') {
            return res.status(400).json({
                error: 'key and documentText (or redactedText) must be strings',
            });
        }

        const originalText = unredactText(key.trim(), textToUnredact);
        if (!originalText) {
            return res.status(404).json({
                error: 'No unredact mapping found for provided key and redacted text',
            });
        }

        return res.status(200).json({
            unredactedText: originalText,
        });
    } catch (error) {
        console.error('[challenge] unredact failed:', error);
        return res.status(500).json({ error: 'Failed to unredact text' });
    }
}
