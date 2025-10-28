/**
 * Design System Type Definitions
 * Core types for the modular note template system
 * Enhanced for Fabric.js integration and advanced image support
 */

export type ModuleType = 'qr' | 'logo' | 'text' | 'denomination' | 'background' | 'image';

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'svg' | 'webp';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  rotation: number; // degrees
  scaleX: number;
  scaleY: number;
  flipX?: boolean;
  flipY?: boolean;
}

export interface GradientConfig {
  enabled: boolean;
  start: string;
  end: string;
  angle: number;
}

export interface BorderConfig {
  enabled: boolean;
  color: string;
  width: number;
  radius?: number;
}

export interface QRModuleConfig {
  backgroundColor?: string;
  borderColor?: string;
  codeColor?: string;
  gradient?: GradientConfig;
  border?: BorderConfig;
}

export interface LogoModuleConfig {
  type: 'cashu' | 'bitcoin' | 'sats' | 'custom';
  url?: string;
  color?: string;
  opacity?: number;
}

export interface TextModuleConfig {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  maxLines?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
}

export interface DenominationModuleConfig {
  color: string;
  backgroundColor?: string;
  gradient?: GradientConfig;
  showUnit: boolean;
  fontSize?: number;
  fontFamily?: string;
}

export interface BackgroundModuleConfig {
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  gradient?: GradientConfig;
  imageUrl?: string;
}

export interface ImageModuleConfig {
  url: string;
  format?: ImageFormat;
  opacity?: number;
  fit: 'contain' | 'cover' | 'fill' | 'none';
  quality?: number; // 0-100 for compression
  originalSize?: Size; // Track original dimensions
  fileSize?: number; // bytes
}

export type ModuleConfig =
  | QRModuleConfig
  | LogoModuleConfig
  | TextModuleConfig
  | DenominationModuleConfig
  | BackgroundModuleConfig
  | ImageModuleConfig;

export interface NoteModule {
  id: string;
  type: ModuleType;
  position: Position;
  size: Size;
  zIndex: number;
  config: ModuleConfig;
  transform?: Transform;
  locked?: boolean; // Prevent editing in visual designer
  visible?: boolean; // Show/hide layer
  name?: string; // Custom layer name
}

export interface NoteTemplate {
  id: string;
  name: string;
  description?: string;
  modules: NoteModule[];
  dimensions: Size;
  version: string;
  createdAt: number;
  updatedAt: number;
  author?: string;
  tags?: string[];
}

export interface NoteDesign {
  templateId: string;
  customModules: Partial<NoteModule>[];
  frontSide: NoteTemplate;
  backSide?: NoteTemplate;
}

export type PrintFormat = 'A4' | 'Letter' | 'Custom';
export type PrintOrientation = 'portrait' | 'landscape';
export type ArrangementMode = 'auto' | 'manual' | 'grid';

export interface PrintConfig {
  format: PrintFormat;
  orientation: PrintOrientation;
  bleedMargin: number; // mm
  cropMarks: boolean;
  doubleSided: boolean;
  cutLines: boolean;
  customDimensions?: Size; // mm
  arrangement: ArrangementMode;
  notesPerPage?: number; // For auto/grid modes
  spacing?: number; // mm between notes
  dpi?: number; // Print resolution (default 300)
}

export interface DesignPreset {
  id: string;
  name: string;
  description?: string;
  template: NoteTemplate;
  thumbnail?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}
