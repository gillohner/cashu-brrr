<script lang="ts">
  import type { DenominationModuleConfig, Position, Size } from '@/types/design';

  interface Props {
    denomination: number;
    config: DenominationModuleConfig;
    position: Position;
    size: Size;
  }

  let { denomination, config, position, size }: Props = $props();

  const gradientId = $derived(`denom-gradient-${Math.random().toString(36).slice(2)}`);
  const bgFill = $derived(
    config.gradient?.enabled
      ? `url(#${gradientId})`
      : config.backgroundColor || 'transparent'
  );

  const fontSize = $derived(config.fontSize || 48);
  const fontFamily = $derived(config.fontFamily || 'monospace');
</script>

<!-- Gradient definition if enabled -->
{#if config.gradient?.enabled}
  <defs>
    <linearGradient
      id={gradientId}
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientTransform="rotate({config.gradient.angle || 0})"
    >
      <stop offset="0%" style="stop-color:{config.gradient.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{config.gradient.end};stop-opacity:1" />
    </linearGradient>
  </defs>
{/if}

<!-- Background -->
{#if config.backgroundColor || config.gradient?.enabled}
  <rect
    x={position.x}
    y={position.y}
    width={size.width}
    height={size.height}
    fill={bgFill}
  />
{/if}

<!-- Denomination Text -->
<text
  x={position.x + size.width / 2}
  y={position.y + size.height / 2}
  text-anchor="middle"
  dominant-baseline="middle"
  fill={config.color}
  font-size={fontSize}
  font-family={fontFamily}
  font-weight="bold"
>
  {denomination}{config.showUnit ? ' sats' : ''}
</text>
