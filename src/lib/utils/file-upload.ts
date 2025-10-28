/**
 * File Upload Utilities
 * Image/SVG upload with preview, compression, and validation
 */

import type { ImageFormat } from '../../types/design';

export interface UploadedFile {
    file: File;
    url: string; // data URL or blob URL
    format: ImageFormat;
    size: number; // bytes
    dimensions: {
        width: number;
        height: number;
    };
    compressed?: boolean;
    quality?: number;
}

export interface UploadOptions {
    maxSizeMB?: number; // Maximum file size
    maxWidth?: number; // Maximum image width
    maxHeight?: number; // Maximum image height
    quality?: number; // 0-100, for compression
    acceptFormats?: ImageFormat[];
    autoCompress?: boolean;
}

const DEFAULT_OPTIONS: Required<UploadOptions> = {
    maxSizeMB: 10,
    maxWidth: 4096,
    maxHeight: 4096,
    quality: 85,
    acceptFormats: ['png', 'jpg', 'jpeg', 'svg', 'webp'],
    autoCompress: true
};

/**
 * Validate and process uploaded image file
 */
export async function processImageUpload(
    file: File,
    options: UploadOptions = {}
): Promise<UploadedFile> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Validate file type
    const format = getImageFormat(file);
    if (!opts.acceptFormats.includes(format)) {
        throw new Error(`Unsupported file format: ${format}. Accepted formats: ${opts.acceptFormats.join(', ')}`);
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > opts.maxSizeMB) {
        throw new Error(`File too large: ${sizeMB.toFixed(2)}MB. Maximum: ${opts.maxSizeMB}MB`);
    }

    // SVG files don't need compression
    if (format === 'svg') {
        return processSVG(file);
    }

    // Load image to get dimensions
    const img = await loadImage(file);
    const dimensions = { width: img.width, height: img.height };

    // Check if compression/resizing is needed
    const needsResize = img.width > opts.maxWidth || img.height > opts.maxHeight;
    const shouldCompress = opts.autoCompress && file.size > 500 * 1024; // > 500KB

    if (needsResize || shouldCompress) {
        return compressImage(img, file, dimensions, opts);
    }

    // Use original file
    return {
        file,
        url: URL.createObjectURL(file),
        format,
        size: file.size,
        dimensions,
        compressed: false
    };
}

/**
 * Compress and/or resize an image
 */
async function compressImage(
    img: HTMLImageElement,
    originalFile: File,
    originalDimensions: { width: number; height: number },
    options: Required<UploadOptions>
): Promise<UploadedFile> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    // Calculate new dimensions maintaining aspect ratio
    let { width, height } = originalDimensions;

    if (width > options.maxWidth || height > options.maxHeight) {
        const ratio = Math.min(options.maxWidth / width, options.maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    // Draw image at new size
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob with compression
    const format = getImageFormat(originalFile);
    const mimeType = getMimeType(format);
    const quality = options.quality / 100;

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to compress image'));
                }
            },
            mimeType,
            quality
        );
    });

    // Create new file from blob
    const file = new File([blob], originalFile.name, { type: mimeType });

    return {
        file,
        url: URL.createObjectURL(blob),
        format,
        size: blob.size,
        dimensions: { width, height },
        compressed: true,
        quality: options.quality
    };
}

/**
 * Process SVG file
 */
async function processSVG(file: File): Promise<UploadedFile> {
    const text = await file.text();
    const dimensions = extractSVGDimensions(text);

    return {
        file,
        url: URL.createObjectURL(file),
        format: 'svg',
        size: file.size,
        dimensions,
        compressed: false
    };
}

/**
 * Extract dimensions from SVG content
 */
function extractSVGDimensions(svgContent: string): { width: number; height: number } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) {
        throw new Error('Invalid SVG file');
    }

    const width = parseFloat(svg.getAttribute('width') || '100');
    const height = parseFloat(svg.getAttribute('height') || '100');

    // If width/height not specified, try viewBox
    if (!svg.hasAttribute('width') && !svg.hasAttribute('height')) {
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
            const parts = viewBox.split(/\s+/);
            return {
                width: parseFloat(parts[2] || '100'),
                height: parseFloat(parts[3] || '100')
            };
        }
    }

    return { width, height };
}

/**
 * Load image from file
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Get image format from file
 */
function getImageFormat(file: File): ImageFormat {
    const ext = file.name.split('.').pop()?.toLowerCase();

    switch (ext) {
        case 'png':
            return 'png';
        case 'jpg':
        case 'jpeg':
            return 'jpg';
        case 'svg':
            return 'svg';
        case 'webp':
            return 'webp';
        default:
            // Try to infer from MIME type
            if (file.type.includes('png')) return 'png';
            if (file.type.includes('jpeg') || file.type.includes('jpg')) return 'jpg';
            if (file.type.includes('svg')) return 'svg';
            if (file.type.includes('webp')) return 'webp';

            throw new Error(`Unknown image format: ${ext || file.type}`);
    }
}

/**
 * Get MIME type from format
 */
function getMimeType(format: ImageFormat): string {
    switch (format) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'svg':
            return 'image/svg+xml';
        case 'webp':
            return 'image/webp';
    }
}

/**
 * Create accept attribute for file input
 */
export function getAcceptAttribute(formats?: ImageFormat[]): string {
    const accepted = formats || DEFAULT_OPTIONS.acceptFormats;
    return accepted.map(getMimeType).join(',');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Clean up blob URLs to prevent memory leaks
 */
export function revokeUploadedFile(uploadedFile: UploadedFile): void {
    if (uploadedFile.url.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedFile.url);
    }
}
