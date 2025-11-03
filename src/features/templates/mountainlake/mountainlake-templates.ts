/**
 * Mountainlake Note Template System
 * Allows saving, loading, and sharing complete note designs
 */

export interface CustomImage {
  id: string;
  url: string;
  x: number;
  y: number;
  opacity: number;
  width: number;
  height: number;
}

export interface MountainlakeTemplateConfig {
  // Top Left Icon
  topLeftIcon: "cashu-logo" | "bitcoin" | "satoshi-v1" | "satoshi-v2" | "satoshi-v3" | "none" | "custom";
  customLogoUrl: string;
  topLeftIconColor: string;
  enableIconColorOverride: boolean;
  topLeftIconSize: number;
  topLeftIconX: number;
  topLeftIconY: number;
  topLeftIconOpacity: number;
  enableTopLeftIcon: boolean;
  
  // Top Right Text
  headerText: string;
  headerTextColor: string;
  headerTextX: number;
  headerTextY: number;
  enableHeaderText: boolean;
  
  // Background
  bgGradientType: 'linear' | 'radial' | 'solid';
  gradientType: 'linear' | 'radial';
  gradientAngle: number;
  gradientStops: Array<{ offset: number; color: string }>;
  radialCenterX: number;
  radialCenterY: number;
  bgSolidColor: string;
  
  // QR Code
  qrGradientType: 'linear' | 'radial' | 'solid';
  qrGradientAngle: number;
  qrGradientStops: Array<{ offset: number; color: string }>;
  qrBackgroundColor: string;
  qrBorderColor: string;
  qrCodeColor: string;
  disableQrBorder: boolean;
  disableQrBackground: boolean;
  enableQrCode: boolean;
  qrX: number;
  qrY: number;
  qrSize: number;
  
  // Bottom
  denominationColor: string;
  bottomBoxColor: string;
  bottomTextColor: string;
  customBottomText: string;
  enableDenomination: boolean;
  denominationX: number;
  denominationY: number;
  
  // Custom Images
  customImages: CustomImage[];
  
  // Guide Text Box
  enableGuideText: boolean;
  guideText: string;
  guideTextColor: string;
  guideBackgroundColor: string;
  guideBorderColor: string;
  disableGuideBorder: boolean;
  disableGuideBackground: boolean;
  guideX: number;
  guideY: number;
  guideWidth: number;
  guideHeight: number;
}

export interface MountainlakeTemplate {
  // Metadata
  name: string;
  description: string;
  author?: string;
  version: string;
  createdAt: string;
  
  // Design Configuration
  front: MountainlakeTemplateConfig;
  back: MountainlakeTemplateConfig;
}

/**
 * Default Mountainlake template configuration
 */
export const DEFAULT_MOUNTAINLAKE_CONFIG: MountainlakeTemplateConfig = {
  topLeftIcon: "cashu-logo",
  customLogoUrl: "",
  topLeftIconColor: "#FFFFFF",
  enableIconColorOverride: false,
  topLeftIconSize: 35,
  topLeftIconX: 10,
  topLeftIconY: 10,
  topLeftIconOpacity: 100,
  enableTopLeftIcon: true,
  
  headerText: "Cashu Token\nRedeemable with Cashu\nWallet of choice",
  headerTextColor: "#FFFFFF",
  headerTextX: 150,
  headerTextY: 0,
  enableHeaderText: true,
  
  bgGradientType: 'linear',
  gradientType: 'linear',
  gradientAngle: 135,
  gradientStops: [
    { offset: 0, color: "#F77F00" },
    { offset: 100, color: "#7209B7" }
  ],
  radialCenterX: 50,
  radialCenterY: 50,
  bgSolidColor: "#F77F00",
  
  qrGradientType: 'solid',
  qrGradientAngle: 90,
  qrGradientStops: [
    { offset: 0, color: "#FFFFFF" },
    { offset: 100, color: "#F0F0F0" }
  ],
  qrBackgroundColor: "#FFFFFF",
  qrBorderColor: "#F77F00",
  qrCodeColor: "#000000",
  disableQrBorder: false,
  disableQrBackground: false,
  enableQrCode: true,
  qrX: 35,
  qrY: 93,
  qrSize: 90,
  
  denominationColor: "#F77F00",
  bottomBoxColor: "#FFFFFF",
  bottomTextColor: "#666666",
  customBottomText: "",
  enableDenomination: true,
  denominationX: 0,
  denominationY: 219,
  
  customImages: [],
  
  enableGuideText: false,
  guideText: "How to redeem:\n1. Download a Cashu wallet\n2. Scan the QR code\n3. Tokens are now in your wallet",
  guideTextColor: "#333333",
  guideBackgroundColor: "#FFFFFF",
  guideBorderColor: "#F77F00",
  disableGuideBorder: false,
  disableGuideBackground: false,
  guideX: 10,
  guideY: 90,
  guideWidth: 140,
  guideHeight: 100,
};

/**
 * Preset Templates
 */
export const PRESET_TEMPLATES: MountainlakeTemplate[] = [
  {
    name: "Classic Orange-Purple",
    description: "The original Cashu BRRR design with vibrant orange to purple gradient",
    author: "Cashu BRRR",
    version: "1.0",
    createdAt: new Date().toISOString(),
    front: { ...DEFAULT_MOUNTAINLAKE_CONFIG },
    back: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      enableQrCode: false,
      enableDenomination: false,
      enableGuideText: true,
      headerText: "Cashu Ecash\nDigital Bearer Asset\nSelf Custody",
    }
  },
  {
    name: "Bitcoin Blue",
    description: "Bitcoin-themed design with blue gradient and Bitcoin symbol",
    author: "Cashu BRRR",
    version: "1.0",
    createdAt: new Date().toISOString(),
    front: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      topLeftIcon: "bitcoin",
      gradientStops: [
        { offset: 0, color: "#0052FF" },
        { offset: 100, color: "#00D4FF" }
      ],
      qrBorderColor: "#0052FF",
      denominationColor: "#0052FF",
    },
    back: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      topLeftIcon: "bitcoin",
      gradientStops: [
        { offset: 0, color: "#0052FF" },
        { offset: 100, color: "#00D4FF" }
      ],
      enableQrCode: false,
      enableDenomination: false,
      enableGuideText: true,
      headerText: "Bitcoin Ecash\nPeer-to-Peer\nElectronic Cash",
      guideBorderColor: "#0052FF",
    }
  },
  {
    name: "Satoshi Green",
    description: "Green nature-inspired design with Satoshi symbol",
    author: "Cashu BRRR",
    version: "1.0",
    createdAt: new Date().toISOString(),
    front: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      topLeftIcon: "satoshi-v1",
      gradientStops: [
        { offset: 0, color: "#10B981" },
        { offset: 100, color: "#059669" }
      ],
      qrBorderColor: "#10B981",
      denominationColor: "#10B981",
    },
    back: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      topLeftIcon: "satoshi-v1",
      gradientStops: [
        { offset: 0, color: "#10B981" },
        { offset: 100, color: "#059669" }
      ],
      enableQrCode: false,
      enableDenomination: false,
      enableGuideText: true,
      headerText: "Satoshi Standard\nSound Money\nFinancial Freedom",
      guideBorderColor: "#10B981",
    }
  },
  {
    name: "Minimal Monochrome",
    description: "Clean black and white minimalist design",
    author: "Cashu BRRR",
    version: "1.0",
    createdAt: new Date().toISOString(),
    front: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      bgGradientType: 'solid',
      bgSolidColor: "#000000",
      headerTextColor: "#FFFFFF",
      qrBackgroundColor: "#FFFFFF",
      qrBorderColor: "#FFFFFF",
      qrCodeColor: "#000000",
      denominationColor: "#000000",
      bottomBoxColor: "#FFFFFF",
      bottomTextColor: "#666666",
    },
    back: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      bgGradientType: 'solid',
      bgSolidColor: "#FFFFFF",
      headerTextColor: "#000000",
      enableQrCode: false,
      enableDenomination: false,
      enableGuideText: true,
      guideBackgroundColor: "#F3F4F6",
      guideBorderColor: "#000000",
      guideTextColor: "#000000",
      headerText: "Ecash Bearer Note\nPrivacy • Freedom\nSelf Custody",
    }
  },
  {
    name: "Sunset Radial",
    description: "Warm sunset colors with radial gradient effect",
    author: "Cashu BRRR",
    version: "1.0",
    createdAt: new Date().toISOString(),
    front: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      bgGradientType: 'radial',
      gradientType: 'radial',
      gradientStops: [
        { offset: 0, color: "#FCD34D" },
        { offset: 50, color: "#F97316" },
        { offset: 100, color: "#DC2626" }
      ],
      radialCenterX: 50,
      radialCenterY: 40,
      qrBorderColor: "#F97316",
      denominationColor: "#DC2626",
    },
    back: {
      ...DEFAULT_MOUNTAINLAKE_CONFIG,
      bgGradientType: 'radial',
      gradientType: 'radial',
      gradientStops: [
        { offset: 0, color: "#FCD34D" },
        { offset: 50, color: "#F97316" },
        { offset: 100, color: "#DC2626" }
      ],
      radialCenterX: 50,
      radialCenterY: 60,
      enableQrCode: false,
      enableDenomination: false,
      enableGuideText: true,
      headerText: "Ecash Token\nDigital Gold\nBearer Instrument",
      guideBorderColor: "#DC2626",
    }
  },
];

/**
 * Export template as JSON file
 */
export function downloadTemplate(
  name: string,
  front: MountainlakeTemplateConfig,
  back: MountainlakeTemplateConfig,
  author?: string
): void {
  const template: MountainlakeTemplate = {
    name,
    description: `Custom template: ${name}`,
    author: author || "Custom User",
    version: "1.0",
    createdAt: new Date().toISOString(),
    front,
    back,
  };

  const json = JSON.stringify(template, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.mountainlake.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate template structure
 */
function isValidTemplate(data: any): data is MountainlakeTemplate {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.name === 'string' &&
    typeof data.version === 'string' &&
    data.front &&
    data.back &&
    typeof data.front === 'object' &&
    typeof data.back === 'object'
  );
}

/**
 * Import template from JSON file
 */
export async function loadTemplateFromFile(file: File): Promise<MountainlakeTemplate> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        if (!isValidTemplate(data)) {
          throw new Error('Invalid template format');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse template file: ' + (error instanceof Error ? error.message : 'Unknown error')));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read template file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Apply template to design configs
 */
export function applyTemplate(
  template: MountainlakeTemplate,
  setFront: (config: MountainlakeTemplateConfig) => void,
  setBack: (config: MountainlakeTemplateConfig) => void
): void {
  // Deep clone to avoid reference issues
  setFront(JSON.parse(JSON.stringify(template.front)));
  setBack(JSON.parse(JSON.stringify(template.back)));
}
