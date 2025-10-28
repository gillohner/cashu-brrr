<script lang="ts">
  import type { QRModuleConfig, Position, Size } from '@/types/design';
  import { QRCodeImage } from 'svelte-qrcode-image';
  import { onMount } from 'svelte';

  interface Props {
    token: string;
    config: QRModuleConfig;
    position: Position;
    size: Size;
    randomId: string;
  }

  let { token, config, position, size, randomId }: Props = $props();
  let imageURL = $state('');

  onMount(() => {
    const canvas = document.getElementById(`qr-${randomId}`) as HTMLCanvasElement | null;
    if (canvas) {
      if (config.codeColor && config.codeColor !== '#000000') {
        applyCustomColor(canvas, config.codeColor);
      }
      imageURL = canvas.toDataURL();
    }
  });

  function applyCustomColor(canvas: HTMLCanvasElement, color: string): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const rgb = hexToRgb(color);

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  const gradientId = $derived(`qr-gradient-${randomId}`);
  const bgFill = $derived(
    config.gradient?.enabled
      ? `url(#${gradientId})`
      : config.backgroundColor || '#FFFFFF'
  );
</script>

<!-- Hidden canvas for QR code generation -->
<div class="invisible h-0">
  <QRCodeImage
    text={token}
    scale={9}
    displayType="canvas"
    displayID={`qr-${randomId}`}
  />
</div>

<!-- Gradient definition if enabled -->
{#if config.gradient?.enabled}
  <defs>
    <linearGradient
      id={gradientId}
      x1="0%"
      y1="0%"
      x2="0%"
      y2="100%"
      gradientTransform="rotate({config.gradient.angle || 0})"
    >
      <stop
        offset="0%"
        style="stop-color:{config.backgroundColor || config.gradient.start};stop-opacity:1"
      />
      <stop offset="100%" style="stop-color:{config.gradient.end};stop-opacity:1" />
    </linearGradient>
  </defs>
{/if}

<!-- Background with optional border -->
{#if config.border?.enabled}
  <rect
    x={position.x}
    y={position.y}
    width={size.width}
    height={size.height}
    fill={bgFill}
    rx={config.border.radius || 0}
    stroke={config.border.color}
    stroke-width={config.border.width}
  />
{:else}
  <rect
    x={position.x}
    y={position.y}
    width={size.width}
    height={size.height}
    fill={bgFill}
  />
{/if}

<!-- QR Code Image -->
{#if imageURL}
  <image
    href={imageURL}
    x={position.x + 5}
    y={position.y + 5}
    width={size.width - 10}
    height={size.height - 10}
    preserveAspectRatio="xMidYMid meet"
    style="mix-blend-mode: multiply;"
  />
{/if}
