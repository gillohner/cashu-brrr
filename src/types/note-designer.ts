/**
 * Note Designer Type Definitions
 * Modular component system for creating custom Cashu banknote designs
 */

/**
 * Component types available in the designer
 */
export type ComponentType = 
  | 'qrcode' 
  | 'text' 
  | 'image' 
  | 'denomination' 
  | 'background' 
  | 'shape';

/**
 * Position, size, and rotation on the canvas
 */
export interface Transform {
  x: number;           // X position (0-160)
  y: number;           // Y position (0-280)
  width: number;       // Width
  height: number;      // Height
  rotation: number;    // Rotation in degrees (0-360)
}

/**
 * Base component interface - all components extend this
 */
export interface DesignComponent {
  id: string;                    // Unique identifier
  type: ComponentType;           // Component type
  transform: Transform;          // Position & size
  zIndex: number;                // Layer order (higher = on top)
  locked: boolean;               // Prevent editing/moving
  visible: boolean;              // Show/hide component
  opacity: number;               // 0-1 opacity
  properties: ComponentProperties;  // Type-specific properties
}

/**
 * Union type of all component-specific properties
 */
export type ComponentProperties = 
  | QRCodeProperties 
  | TextProperties 
  | ImageProperties 
  | DenominationProperties
  | BackgroundProperties
  | ShapeProperties;

/**
 * QR Code component properties
 */
export interface QRCodeProperties {
  token: string;                              // Cashu token to encode
  foregroundColor: string;                    // QR code color
  backgroundColor: string;                    // Background color
  cornerRadius: number;                       // Rounded corners (0-10)
  errorCorrection: 'L' | 'M' | 'Q' | 'H';    // Error correction level
  includeMargin: boolean;                     // Add quiet zone around QR
}

/**
 * Text component properties
 */
export interface TextProperties {
  content: string;                            // Text content (supports \n)
  fontSize: number;                           // Font size in px
  fontFamily: string;                         // Font family name
  fontWeight: number;                         // 100-900
  color: string;                              // Text color
  textAlign: 'left' | 'center' | 'right';    // Horizontal alignment
  lineHeight: number;                         // Line height multiplier
  letterSpacing: number;                      // Letter spacing in px
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

/**
 * Image component properties
 */
export interface ImageProperties {
  src: string;                                // URL or data URL
  fit: 'cover' | 'contain' | 'fill' | 'none'; // How image fits in bounds
  filter?: string;                            // CSS filter (e.g., 'grayscale(100%)')
  opacity?: number;                           // Image opacity 0-1
}

/**
 * Denomination component properties
 */
export interface DenominationProperties {
  value: number;                              // Denomination value
  unit: string;                               // Unit (sat, usd, etc.)
  fontSize: number;                           // Font size
  color: string;                              // Text color
  showSymbol: boolean;                        // Show currency symbol
  format: 'number' | 'abbreviated' | 'words'; // Display format
}

/**
 * Background component properties
 */
export interface BackgroundProperties {
  type: 'solid' | 'gradient' | 'image';      // Background type
  color?: string;                             // Solid color
  gradientStart?: string;                     // Gradient start color
  gradientEnd?: string;                       // Gradient end color
  gradientAngle?: number;                     // Gradient angle 0-360
  gradientType?: 'linear' | 'radial';        // Gradient type
  imageSrc?: string;                          // Background image URL
  imageOpacity?: number;                      // Image opacity 0-1
  imageBlur?: number;                         // Blur amount in px
}

/**
 * Shape component properties
 */
export interface ShapeProperties {
  shape: 'rectangle' | 'circle' | 'ellipse' | 'line' | 'polygon';
  fill?: string;                              // Fill color
  stroke?: string;                            // Stroke color
  strokeWidth?: number;                       // Stroke width in px
  cornerRadius?: number;                      // Corner radius for rectangles
  dashArray?: string;                         // SVG dash array for dashed lines
  points?: { x: number; y: number }[];       // Points for polygon
}

/**
 * Complete design state for a single note
 */
export interface NoteDesign {
  id: string;                                 // Unique design ID
  name: string;                               // Design name
  components: DesignComponent[];              // All components in the design
  canvas: {
    width: number;                            // Canvas width (default: 160)
    height: number;                           // Canvas height (default: 280)
    backgroundColor?: string;                 // Canvas background color
  };
  metadata: {
    createdAt: number;                        // Creation timestamp
    updatedAt: number;                        // Last update timestamp
    version: string;                          // Design format version
    author?: string;                          // Design author
    description?: string;                     // Design description
    tags?: string[];                          // Searchable tags
  };
}

/**
 * Template preset with metadata
 */
export interface DesignTemplate {
  id: string;                                 // Template ID
  name: string;                               // Template name
  thumbnail: string;                          // Preview image URL
  description: string;                        // Template description
  design: NoteDesign;                         // The actual design
  category: 'classic' | 'modern' | 'minimal' | 'artistic' | 'custom';
  isPremium?: boolean;                        // Premium template flag
  author?: string;                            // Template creator
  downloads?: number;                         // Download count
}

/**
 * Export format options
 */
export interface ExportOptions {
  format: 'svg' | 'png' | 'json';            // Export format
  scale: number;                              // Scale multiplier (1-4)
  backgroundColor?: string;                   // Background color for PNG
  includeMetadata?: boolean;                  // Include metadata in JSON
}

/**
 * Tool types for the canvas
 */
export type ToolType = 
  | 'select'     // Select and move components
  | 'text'       // Add text
  | 'shape'      // Draw shapes
  | 'image'      // Add images
  | 'pan'        // Pan canvas
  | 'zoom';      // Zoom canvas

/**
 * Selection state
 */
export interface SelectionState {
  componentIds: string[];                     // Selected component IDs
  bounds?: {                                  // Bounding box of selection
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Alignment options
 */
export type AlignmentType = 
  | 'left' 
  | 'center' 
  | 'right' 
  | 'top' 
  | 'middle' 
  | 'bottom';

/**
 * Distribution options
 */
export type DistributionType = 
  | 'horizontal' 
  | 'vertical';
