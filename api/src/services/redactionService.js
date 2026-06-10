import crypto from 'crypto';

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Almacen temporal en memoria para demo de Part 2 (se reinicia al reiniciar el servidor).
const unredactStore = new Map();

// Parsea terminos censurados separados por comas/espacios y respeta frases entre comillas.
export function parseCensoredInput(censoredInput = '') {
    if (!censoredInput || typeof censoredInput !== 'string') return [];

    const normalized = censoredInput.replace(/,/g, ' ').trim();
    const pattern = /"([^"]+)"|'([^']+)'|(\S+)/g;
    const parsed = [];

    for (const match of normalized.matchAll(pattern)) {
        const token = (match[1] || match[2] || match[3] || '').trim();
        if (token) parsed.push(token);
    }

    // Quita duplicados ignorando mayusculas/minusculas.
    const seen = new Set();
    return parsed.filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// Reemplaza keywords y frases por XXXX, priorizando frases largas para evitar solapamientos.
export function redactText(documentText = '', censoredInput = '', replacement = 'XXXX') {
    if (typeof documentText !== 'string') {
        throw new Error('documentText must be a string');
    }

    const terms = parseCensoredInput(censoredInput)
        .sort((a, b) => b.length - a.length);

    let redacted = documentText;

    for (const term of terms) {
        const escaped = escapeRegex(term);
        const expression = new RegExp(escaped, 'gi');
        redacted = redacted.replace(expression, replacement);
    }

    return {
        redactedText: redacted,
        parsedTerms: terms,
    };
}

function buildUnredactRecordId(key, redactedText) {
    return crypto.createHash('sha256').update(`${key}::${redactedText}`).digest('hex');
}

export function generateUnredactKey() {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Registra el texto original asociado a una llave y a su version redactada.
export function storeUnredactMapping(key, redactedText, originalText) {
    const recordId = buildUnredactRecordId(key, redactedText);
    unredactStore.set(recordId, {
        originalText,
        createdAt: Date.now(),
    });
}

// Resuelve el texto original usando la llave y el texto redactado.
export function unredactText(key, redactedText) {
    const recordId = buildUnredactRecordId(key, redactedText);
    const record = unredactStore.get(recordId);
    if (!record) return null;
    return record.originalText;
}
