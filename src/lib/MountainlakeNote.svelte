<script lang="ts">
  import { onMount } from "svelte";
  import { QRCodeImage } from "svelte-qrcode-image";
  import { secp256k1 } from "@noble/curves/secp256k1";
  import { bytesToHex } from "@noble/curves/abstract/utils";

  interface GradientStop {
    offset: number; // 0-100
    color: string;
  }

  interface CustomLayer {
    id: string;
    type: 'image' | 'text' | 'shape';
    x: number;
    y: number;
    width: number;
    height: number;
    content: string; // URL for image, text content for text
    rotation?: number;
    opacity?: number;
  }

  interface Props {
    /** Token denomination value */
    denomination: number;
    /** Mint URL */
    mintUrl?: string;
    /** Encoded Cashu token */
    token: string;

    /** Top left icon type */
    topLeftIcon?: "cashu" | "bitcoin" | "sats" | "custom" | "none";
    /** Custom logo URL if topLeftIcon is 'custom' */
    customLogoUrl?: string;
    /** Top left icon color */
    topLeftIconColor?: string;

    /** Header text (supports newlines) */
    headerText?: string;
    /** Header text color */
    headerTextColor?: string;

    /** Background gradient type (solid, linear, or radial) */
    bgGradientType?: 'linear' | 'radial' | 'solid';
    /** Solid background color (used when bgGradientType is 'solid') */
    bgSolidColor?: string;
    /** Background gradient type (deprecated, use bgGradientType) */
    gradientType?: 'linear' | 'radial';
    /** Background gradient stops (multi-color support) */
    gradientStops?: GradientStop[];
    /** Background gradient angle for linear (0-360) */
    gradientAngle?: number;
    /** Radial gradient center X (0-100) */
    radialCenterX?: number;
    /** Radial gradient center Y (0-100) */
    radialCenterY?: number;

    /** Legacy: Background gradient start color (deprecated, use gradientStops) */
    gradientStart?: string;
    /** Legacy: Background gradient end color (deprecated, use gradientStops) */
    gradientEnd?: string;

    /** QR code background type */
    qrGradientType?: 'linear' | 'radial' | 'solid';
    /** QR background gradient stops */
    qrGradientStops?: GradientStop[];
    /** QR gradient angle */
    qrGradientAngle?: number;
    /** QR code border color */
    qrBorderColor?: string;
    /** Disable QR code background */
    disableQrBackground?: boolean;
    /** Disable QR code border */
    disableQrBorder?: boolean;
    /** QR code foreground color */
    qrCodeColor?: string;

    /** Legacy QR props (deprecated) */
    qrBackgroundColor?: string;
    qrBackgroundGradientEnd?: string;
    useQrGradient?: boolean;

    /** Denomination text color */
    denominationColor?: string;

    /** Bottom box gradient type */
    denomGradientType?: 'linear' | 'radial' | 'solid';
    /** Bottom box gradient stops */
    denomGradientStops?: GradientStop[];
    /** Bottom box gradient angle */
    denomGradientAngle?: number;
    /** Disable bottom box background */
    disableDenomBackground?: boolean;
    /** Bottom text color */
    bottomTextColor?: string;
    /** Custom bottom text */
    customBottomText?: string;

    /** Legacy denom props (deprecated) */
    bottomBoxColor?: string;
    bottomBoxGradientEnd?: string;
    useDenomGradient?: boolean;

    /** Custom layers for images/graphics */
    customLayers?: CustomLayer[];
  }

  let {
    denomination,
    token,

    topLeftIcon = "cashu",
    customLogoUrl = "",
    topLeftIconColor = "#FFFFFF",

    headerText = "Cashu Token\nRedeemable with Cashu\nWallet of choice",
    headerTextColor = "#FFFFFF",

    bgGradientType = 'linear',
    bgSolidColor = "#F77F00",
    gradientType = 'linear',
    gradientStops,
    gradientAngle = 135,
    radialCenterX = 50,
    radialCenterY = 50,

    // Legacy support
    gradientStart = "#F77F00",
    gradientEnd = "#7209B7",

    qrGradientType = 'solid',
    qrGradientStops,
    qrGradientAngle = 90,
    qrBorderColor = "#F77F00",
    disableQrBackground = false,
    disableQrBorder = false,
    qrCodeColor = "#000000",

    // Legacy QR support
    qrBackgroundColor = "#FFFFFF",
    qrBackgroundGradientEnd = "#FFFFFF",
    useQrGradient = false,

    denominationColor = "#F77F00",

    denomGradientType = 'solid',
    denomGradientStops,
    denomGradientAngle = 90,
    disableDenomBackground = false,
    bottomTextColor = "#666666",
    customBottomText = "",

    // Legacy denom support
    bottomBoxColor = "#FFFFFF",
    bottomBoxGradientEnd = "#FFFFFF",
    useDenomGradient = false,

    customLayers = [],
  }: Props = $props();

  let imageURL = $state("");
  let originalQRCanvas = $state<HTMLCanvasElement | null>(null);
  const randomID = bytesToHex(secp256k1.utils.randomPrivateKey()).slice(0, 12);

  // Convert legacy gradient props to new format - use $derived for reactivity
  const bgStops = $derived(gradientStops || [
    { offset: 0, color: gradientStart },
    { offset: 100, color: gradientEnd }
  ]);

  const qrStops = $derived(qrGradientStops || (useQrGradient ? [
    { offset: 0, color: qrBackgroundColor },
    { offset: 100, color: qrBackgroundGradientEnd }
  ] : [{ offset: 0, color: qrBackgroundColor }]));

  const denomStops = $derived(denomGradientStops || (useDenomGradient ? [
    { offset: 0, color: bottomBoxColor },
    { offset: 100, color: bottomBoxGradientEnd }
  ] : [{ offset: 0, color: bottomBoxColor }]));

  // Calculate gradient coordinates from angle
  const getLinearGradientCoords = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(radians);
    const y1 = 50 - 50 * Math.sin(radians);
    const x2 = 50 + 50 * Math.cos(radians);
    const y2 = 50 + 50 * Math.sin(radians);
    return { x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` };
  };

  const bgCoords = $derived(getLinearGradientCoords(gradientAngle));
  const qrCoords = $derived(getLinearGradientCoords(qrGradientAngle));
  const denomCoords = $derived(getLinearGradientCoords(denomGradientAngle));

  const processQRCode = () => {
    const canvas = document.getElementById(
      `qr-${randomID}`,
    ) as HTMLCanvasElement | null;
    if (canvas) {
      // Save original canvas if not already saved
      if (!originalQRCanvas) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
          originalQRCanvas = tempCanvas;
        }
      }

      // Start from the original QR code
      if (originalQRCanvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Clear and redraw from original
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(originalQRCanvas, 0, 0);

          // Apply custom QR code color if specified
          if (qrCodeColor !== "#000000") {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convert hex color to RGB
            const hex = qrCodeColor.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            // Replace black pixels with custom color
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                data[i] = r; // Red
                data[i + 1] = g; // Green
                data[i + 2] = b; // Blue
                // Alpha stays the same
              }
            }

            ctx.putImageData(imageData, 0, 0);
          }

          imageURL = canvas.toDataURL();
        }
      }
    }
  };

  onMount(() => {
    processQRCode();
  });

  // Reactive effect to update QR code color when it changes
  $effect(() => {
    // Track qrCodeColor as a dependency
    void qrCodeColor;
    
    // Process QR code whenever qrCodeColor changes
    if (imageURL) {
      processQRCode();
    }
  });
</script>

<!-- QR Code Generator (Hidden) -->
<div class="invisible h-0">
  <QRCodeImage
    text={token}
    scale={9}
    displayType="canvas"
    displayID={`qr-${randomID}`}
  />
</div>

<!-- SVG Note Design -->
<div class="w-full">
  <svg
    viewBox="0 0 160 280"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full"
  >
    <defs>
      <!-- Background Gradient -->
      {#if bgGradientType === 'solid'}
        <!-- No gradient needed for solid color -->
      {:else if (bgGradientType || gradientType) === 'linear'}
        <linearGradient
          id="bgGradient-{randomID}"
          x1={bgCoords.x1}
          y1={bgCoords.y1}
          x2={bgCoords.x2}
          y2={bgCoords.y2}
        >
          {#each bgStops as stop}
            <stop offset="{stop.offset}%" style="stop-color:{stop.color};stop-opacity:1" />
          {/each}
        </linearGradient>
      {:else}
        <radialGradient
          id="bgGradient-{randomID}"
          cx="{radialCenterX}%"
          cy="{radialCenterY}%"
          r="70%"
        >
          {#each bgStops as stop}
            <stop offset="{stop.offset}%" style="stop-color:{stop.color};stop-opacity:1" />
          {/each}
        </radialGradient>
      {/if}

      <!-- QR Background Gradient -->
      {#if qrGradientType === 'linear'}
        <linearGradient
          id="qrGradient-{randomID}"
          x1={qrCoords.x1}
          y1={qrCoords.y1}
          x2={qrCoords.x2}
          y2={qrCoords.y2}
        >
          {#each qrStops as stop}
            <stop offset="{stop.offset}%" style="stop-color:{stop.color};stop-opacity:1" />
          {/each}
        </linearGradient>
      {:else if qrGradientType === 'radial'}
        <radialGradient
          id="qrGradient-{randomID}"
          cx="50%"
          cy="50%"
          r="70%"
        >
          {#each qrStops as stop}
            <stop offset="{stop.offset}%" style="stop-color:{stop.color};stop-opacity:1" />
          {/each}
        </radialGradient>
      {/if}

      <!-- Denomination Background Gradient -->
      {#if denomGradientType === 'linear'}
        <linearGradient
          id="denomGradient-{randomID}"
          x1={denomCoords.x1}
          y1={denomCoords.y1}
          x2={denomCoords.x2}
          y2={denomCoords.y2}
        >
          {#each denomStops as stop}
            <stop offset="{stop.offset}%" style="stop-color:{stop.color};stop-opacity:1" />
          {/each}
        </linearGradient>
      {:else if denomGradientType === 'radial'}
        <radialGradient
          id="denomGradient-{randomID}"
          cx="50%"
          cy="50%"
          r="70%"
        >
          {#each denomStops as stop}
            <stop offset="{stop.offset}%" style="stop-color:{stop.color};stop-opacity:1" />
          {/each}
        </radialGradient>
      {/if}
    </defs>

    <!-- Background -->
    <rect 
      width="160" 
      height="280" 
      fill={bgGradientType === 'solid' ? bgSolidColor : `url(#bgGradient-${randomID})`} 
      rx="0" 
    />

    <!-- Top Left Logo -->
    {#if topLeftIcon !== "none"}
    <g id="logo-placeholder" transform="translate(10, 10)">
      {#if topLeftIcon === "custom" && customLogoUrl}
        <image href={customLogoUrl} width="35" height="35" />
      {:else if topLeftIcon === "cashu"}
        <!-- Cashu Logo (from your SVG) -->
        <path
          d="m 6.367787,17.294186 c 2.889785,1.400491 6.532758,2.899016 10.54464,0.700245 3.08961,-1.680589 1.275809,-5.33587 -1.967513,-5.503929 -3.350921,-0.168059 -4.180965,-1.008354 -4.88804,-2.198771 0,0 -0.753189,-1.834643 0.184454,-3.473218 0.937643,-1.638574 2.56699,-5.013757 -0.76856,-7.5346412 -3.335549,-2.5208837 -9.4840267,0.280098 -9.6377387,6.7083522 -0.1537119,6.428253 3.6429727,9.901471 6.5327577,11.301962 z"
          fill={topLeftIconColor}
          stroke={gradientStart}
          stroke-width="0.5"
        />
      {:else if topLeftIcon === "bitcoin"}
        <!-- Bitcoin Logo -->
        <circle
          cx="17.5"
          cy="17.5"
          r="17"
          fill="none"
          stroke={topLeftIconColor}
          stroke-width="2"
        />
        <path
          d="M 10 7 L 10 28 M 10 7 L 20 7 C 24 7 24 13 20 13 L 10 13 M 10 13 L 21 13 C 25 13 25 19 21 19 L 10 19"
          stroke={topLeftIconColor}
          stroke-width="2.5"
          fill="none"
          stroke-linecap="round"
        />
      {:else if topLeftIcon === "sats"}
        <!-- Sats Icon (three lines) -->
        <g transform="translate(8, 8)">
          <line
            x1="0"
            y1="5"
            x2="20"
            y2="5"
            stroke={topLeftIconColor}
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <line
            x1="0"
            y1="12"
            x2="20"
            y2="12"
            stroke={topLeftIconColor}
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <line
            x1="0"
            y1="19"
            x2="20"
            y2="19"
            stroke={topLeftIconColor}
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </g>
      {/if}
    </g>
    {/if}

    <!-- Top Right Header Text -->
    <g id="header-text" transform="translate(150, 0)">
      {#each headerText.split("\n").slice(0, 3) as line, i}
        <text
          x="0"
          y={13 + i * 6.7}
          font-family="'Noto Sans Adlam', Arial, sans-serif"
          font-size="5.33"
          font-weight="500"
          fill={headerTextColor}
          text-anchor="end"
        >
          {line.length > 25 ? line.slice(0, 25) + "..." : line}
        </text>
      {/each}
    </g>

    <!-- QR Code Area Background -->
    {#if !disableQrBackground}
      <rect
        id="qr-container"
        x="26.98"
        y="84.61"
        width="107.82"
        height="106.34"
        fill={qrGradientType === 'solid'
          ? qrStops[0].color
          : `url(#qrGradient-${randomID})`}
        rx="6.74"
        stroke={disableQrBorder ? "none" : qrBorderColor}
        stroke-width={disableQrBorder ? "0" : "1.67"}
      />
    {/if}

    <!-- QR Code Image -->
    {#if imageURL}
      <image
        href={imageURL}
        x="35"
        y="93"
        width="90"
        height="90"
        preserveAspectRatio="xMidYMid meet"
        style="mix-blend-mode: multiply;"
      />
    {/if}

    <!-- Bottom Box -->
    {#if !disableDenomBackground}
      <rect
        id="bottom-box"
        x="0"
        y="216.44"
        width="160"
        height="56.08"
        fill={denomGradientType === 'solid'
          ? denomStops[0].color
          : `url(#denomGradient-${randomID})`}
      />
    {/if}

    <!-- Custom Layers (images, text, shapes) -->
    {#each customLayers as layer (layer.id)}
      {#if layer.type === 'image'}
        <image
          href={layer.content}
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          transform={layer.rotation ? `rotate(${layer.rotation} ${layer.x + layer.width/2} ${layer.y + layer.height/2})` : ''}
          opacity={layer.opacity ?? 1}
        />
      {:else if layer.type === 'text'}
        <text
          x={layer.x}
          y={layer.y}
          font-family="Arial"
          font-size={layer.height || 12}
          fill={layer.content}
          transform={layer.rotation ? `rotate(${layer.rotation} ${layer.x} ${layer.y})` : ''}
          opacity={layer.opacity ?? 1}
        >
          {layer.content}
        </text>
      {:else if layer.type === 'shape'}
        <rect
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          fill={layer.content}
          transform={layer.rotation ? `rotate(${layer.rotation} ${layer.x + layer.width/2} ${layer.y + layer.height/2})` : ''}
          opacity={layer.opacity ?? 1}
        />
      {/if}
    {/each}

    <!-- Denomination Group -->
    <g id="denomination" transform="translate(0.3, -3.56)">
      <!-- Denomination Number -->
      <text
        x="6"
        y="245.25"
        font-family="Arial"
        font-size="20"
        font-weight="700"
        fill={denominationColor}
      >
        {denomination.toLocaleString()}
      </text>

      <!-- Bottom Text -->
      <g id="bottom-text" transform="translate(6, 256)">
        {#each customBottomText.split("\n") as line, i}
          <text
            x="0"
            y={i * 8}
            font-family="Arial"
            font-size="7"
            fill={bottomTextColor}
            text-anchor="start"
          >
            {line}
          </text>
        {/each}
      </g>
    </g></svg
  >
</div>
