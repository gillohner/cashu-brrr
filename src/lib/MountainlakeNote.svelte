<script lang="ts">
  import { onMount } from "svelte";
  import { QRCodeImage } from "svelte-qrcode-image";
  import { secp256k1 } from "@noble/curves/secp256k1";
  import { bytesToHex } from "@noble/curves/abstract/utils";

  interface Props {
    /** Token denomination value */
    denomination: number;
    /** Mint URL */
    mintUrl: string;
    /** Encoded Cashu token */
    token: string;

    /** Top left icon type */
    topLeftIcon?: "cashu" | "bitcoin" | "sats" | "custom";
    /** Custom logo URL if topLeftIcon is 'custom' */
    customLogoUrl?: string;

    /** Header text (supports newlines) */
    headerText?: string;
    /** Header text color */
    headerTextColor?: string;

    /** Background gradient start color */
    gradientStart?: string;
    /** Background gradient end color */
    gradientEnd?: string;
    /** Background gradient angle (0-360) */
    gradientAngle?: number;

    /** QR code background color */
    qrBackgroundColor?: string;
    /** QR code background gradient end color */
    qrBackgroundGradientEnd?: string;
    /** Enable QR code background gradient */
    useQrGradient?: boolean;
    /** QR code border color */
    qrBorderColor?: string;
    /** Disable QR code background */
    disableQrBackground?: boolean;
    /** Disable QR code border */
    disableQrBorder?: boolean;
    /** QR code foreground color */
    qrCodeColor?: string;

    /** Denomination text color */
    denominationColor?: string;

    /** Bottom box background color */
    bottomBoxColor?: string;
    /** Bottom box gradient end color */
    bottomBoxGradientEnd?: string;
    /** Enable bottom box gradient */
    useDenomGradient?: boolean;
    /** Disable bottom box background */
    disableDenomBackground?: boolean;
    /** Bottom text color */
    bottomTextColor?: string;
    /** Custom bottom text */
    customBottomText?: string;
  }

  let {
    denomination,
    mintUrl,
    token,

    topLeftIcon = "cashu",
    customLogoUrl = "",

    headerText = "Cashu Token\nRedeemable with Cashu\nWallet of choice",
    headerTextColor = "#FFFFFF",

    gradientStart = "#F77F00",
    gradientEnd = "#7209B7",
    gradientAngle = 135,

    qrBackgroundColor = "#FFFFFF",
    qrBackgroundGradientEnd = "#FFFFFF",
    useQrGradient = false,
    qrBorderColor = "#F77F00",
    disableQrBackground = false,
    disableQrBorder = false,
    qrCodeColor = "#000000",

    denominationColor = "#F77F00",

    bottomBoxColor = "#FFFFFF",
    bottomBoxGradientEnd = "#FFFFFF",
    useDenomGradient = false,
    disableDenomBackground = false,
    bottomTextColor = "#666666",
    customBottomText = "",
  }: Props = $props();

  let imageURL = $state("");
  const randomID = bytesToHex(secp256k1.utils.randomPrivateKey()).slice(0, 12);

  // Extract domain from mintUrl for default text
  const getMintDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.toUpperCase();
      return domain;
    } catch {
      return "MINT.MOUNTAINLAKE.IO";
    }
  };

  const processQRCode = () => {
    const canvas = document.getElementById(
      `qr-${randomID}`,
    ) as HTMLCanvasElement | null;
    if (canvas) {
      // Apply custom QR code color if specified
      if (qrCodeColor !== "#000000") {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Replace black pixels with custom color
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
              // Convert hex color to RGB
              const hex = qrCodeColor.replace("#", "");
              const r = parseInt(hex.substr(0, 2), 16);
              const g = parseInt(hex.substr(2, 2), 16);
              const b = parseInt(hex.substr(4, 2), 16);

              data[i] = r; // Red
              data[i + 1] = g; // Green
              data[i + 2] = b; // Blue
              // Alpha stays the same
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }
      }

      imageURL = canvas.toDataURL();
    }
  };

  onMount(() => {
    processQRCode();
  });

  // Reactive effect to update QR code color when it changes
  $effect(() => {
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
      <linearGradient
        id="bgGradient-{randomID}"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" style="stop-color:{gradientStart};stop-opacity:1" />
        <stop offset="100%" style="stop-color:{gradientEnd};stop-opacity:1" />
      </linearGradient>

      <!-- QR Background Gradient (optional) -->
      <linearGradient
        id="qrGradient-{randomID}"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop
          offset="0%"
          style="stop-color:{qrBackgroundColor};stop-opacity:1"
        />
        <stop
          offset="100%"
          style="stop-color:{qrBackgroundGradientEnd};stop-opacity:1"
        />
      </linearGradient>

      <!-- Denomination Background Gradient (optional) -->
      <linearGradient
        id="denomGradient-{randomID}"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" style="stop-color:{bottomBoxColor};stop-opacity:1" />
        <stop
          offset="100%"
          style="stop-color:{bottomBoxGradientEnd};stop-opacity:1"
        />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="160" height="280" fill="url(#bgGradient-{randomID})" rx="0" />

    <!-- Top Left Logo -->
    <g id="logo-placeholder" transform="translate(10, 10)">
      {#if topLeftIcon === "custom" && customLogoUrl}
        <image href={customLogoUrl} width="35" height="35" />
      {:else if topLeftIcon === "cashu"}
        <!-- Cashu Logo (from your SVG) -->
        <path
          d="m 6.367787,17.294186 c 2.889785,1.400491 6.532758,2.899016 10.54464,0.700245 3.08961,-1.680589 1.275809,-5.33587 -1.967513,-5.503929 -3.350921,-0.168059 -4.180965,-1.008354 -4.88804,-2.198771 0,0 -0.753189,-1.834643 0.184454,-3.473218 0.937643,-1.638574 2.56699,-5.013757 -0.76856,-7.5346412 -3.335549,-2.5208837 -9.4840267,0.280098 -9.6377387,6.7083522 -0.1537119,6.428253 3.6429727,9.901471 6.5327577,11.301962 z"
          fill={headerTextColor}
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
          stroke={headerTextColor}
          stroke-width="2"
        />
        <path
          d="M 10 7 L 10 28 M 10 7 L 20 7 C 24 7 24 13 20 13 L 10 13 M 10 13 L 21 13 C 25 13 25 19 21 19 L 10 19"
          stroke={headerTextColor}
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
            stroke={headerTextColor}
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <line
            x1="0"
            y1="12"
            x2="20"
            y2="12"
            stroke={headerTextColor}
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <line
            x1="0"
            y1="19"
            x2="20"
            y2="19"
            stroke={headerTextColor}
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </g>
      {/if}
    </g>

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
        fill={useQrGradient
          ? `url(#qrGradient-${randomID})`
          : qrBackgroundColor}
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
        fill={useDenomGradient
          ? `url(#denomGradient-${randomID})`
          : bottomBoxColor}
      />
    {/if}

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
