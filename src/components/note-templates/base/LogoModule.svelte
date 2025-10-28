<script lang="ts">
  import type { LogoModuleConfig, Position, Size } from '@/types/design';

  interface Props {
    config: LogoModuleConfig;
    position: Position;
    size: Size;
  }

  let { config, position, size }: Props = $props();

  // Logo paths for different types
  const logos = {
    cashu: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="${config.color || '#000'}" opacity="${config.opacity || 1}"/>
        <text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-weight="bold">₵</text>
      </svg>
    `,
    bitcoin: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="${config.color || '#f7931a'}" opacity="${config.opacity || 1}"/>
        <text x="50" y="65" text-anchor="middle" fill="white" font-size="50" font-weight="bold">₿</text>
      </svg>
    `,
    sats: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <text x="50" y="60" text-anchor="middle" fill="${config.color || '#000'}" opacity="${config.opacity || 1}" font-size="35" font-weight="bold">sats</text>
      </svg>
    `,
    custom: config.url || '',
  };

  const logoContent = $derived(logos[config.type]);
  const isCustom = $derived(config.type === 'custom' && config.url);
</script>

{#if isCustom}
  <image
    href={config.url}
    x={position.x}
    y={position.y}
    width={size.width}
    height={size.height}
    opacity={config.opacity || 1}
    preserveAspectRatio="xMidYMid meet"
  />
{:else}
  <g transform="translate({position.x}, {position.y})">
    <foreignObject width={size.width} height={size.height}>
      {@html logoContent}
    </foreignObject>
  </g>
{/if}
