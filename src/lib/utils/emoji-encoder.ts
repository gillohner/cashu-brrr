/**
 * Cashu Nut (🥜) Encoder
 * 
 * Simple encoding for Cashu tokens using the 🥜 prefix format.
 * This is the standard Cashu sharing format, not a complex emoji encoding.
 * 
 * Format: 🥜<base64-encoded-token>
 * 
 * Example:
 * cashuAey... → �cashuAey...
 * 
 * Benefits:
 * - Recognizable cashu branding (� = "nut")
 * - Easy to spot in messages
 * - No complex encoding/decoding
 * - URL-safe when properly encoded
 */

const CASHU_NUT_PREFIX = '�';

/**
 * Encode a Cashu token with the � prefix
 * 
 * @param token - Cashu token string (cashuA...)
 * @returns Token with � prefix
 */
export function encodeWithNut(token: string): string {
    return CASHU_NUT_PREFIX + token;
}

/**
 * Decode a �-prefixed Cashu token
 * 
 * @param nutToken - Token with � prefix
 * @returns Original Cashu token
 */
export function decodeNutToken(nutToken: string): string {
    if (!nutToken.startsWith(CASHU_NUT_PREFIX)) {
        throw new Error('Invalid nut token: must start with �');
    }
    return nutToken.slice(CASHU_NUT_PREFIX.length);
}

/**
 * Check if a string is a valid nut token
 * 
 * @param text - Text to check
 * @returns True if valid nut token
 */
export function isNutToken(text: string): boolean {
    return text.startsWith(CASHU_NUT_PREFIX) && text.length > CASHU_NUT_PREFIX.length;
}

/**
 * Create shareable text for a Cashu token
 * 
 * @param token - Cashu token string
 * @param amount - Optional amount in sats
 * @param message - Optional custom message
 * @returns Formatted share text
 */
export function createShareText(
    token: string,
    amount?: number,
    message?: string
): string {
    const nutToken = encodeWithNut(token);

    let shareText = '';

    if (message) {
        shareText += message + '\n\n';
    } else if (amount) {
        shareText += `🎉 ${amount.toLocaleString()} sats for you! 🎉\n\n`;
    } else {
        shareText += '🎉 Cashu for you! 🎉\n\n';
    }

    shareText += nutToken;
    shareText += '\n\nClaim at: https://cashu.me';

    return shareText;
}

/**
 * Extract nut token from URL parameters
 * Checks for common parameter names: token, nut, cashu
 * 
 * @param url - URL to check (defaults to current window location)
 * @returns Decoded token or null
 */
export function extractNutTokenFromURL(url?: string): string | null {
    const searchParams = new URLSearchParams(
        url ? new URL(url).search : window.location.search
    );

    // Check common parameter names
    const paramNames = ['token', 'nut', 'cashu', 'claim'];

    for (const param of paramNames) {
        const value = searchParams.get(param);
        if (value && isNutToken(value)) {
            try {
                return decodeNutToken(value);
            } catch {
                // Invalid format, continue checking
            }
        }
    }

    return null;
}

/**
 * Create a URL with an embedded nut token
 * 
 * @param baseURL - Base URL (e.g., https://yourapp.com)
 * @param token - Cashu token to embed
 * @param paramName - URL parameter name (default: 'token')
 * @returns URL with token parameter
 */
export function createClaimURL(
    baseURL: string,
    token: string,
    paramName = 'token'
): string {
    const url = new URL(baseURL);
    const nutToken = encodeWithNut(token);
    url.searchParams.set(paramName, nutToken);
    return url.toString();
}

/**
 * Extract token from clipboard text
 * Looks for both raw tokens and nut-encoded tokens
 * 
 * @param text - Clipboard text
 * @returns Extracted token or null
 */
export function extractTokenFromText(text: string): string | null {
    // Check for nut-encoded token
    const nutMatch = text.match(/🥜(cashu[A-Za-z0-9+/=_-]+)/);
    if (nutMatch) {
        return nutMatch[1];
    }

    // Check for raw token
    const rawMatch = text.match(/(cashu[A-Za-z0-9+/=_-]+)/);
    if (rawMatch) {
        return rawMatch[1];
    }

    return null;
}
