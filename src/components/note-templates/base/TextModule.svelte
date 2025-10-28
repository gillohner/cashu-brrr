<script lang="ts">
  import type { TextModuleConfig, Position, Size } from '@/types/design';

  interface Props {
    config: TextModuleConfig;
    position: Position;
    size: Size;
  }

  let { config, position, size }: Props = $props();

  const fontSize = $derived(config.fontSize || 16);
  const fontFamily = $derived(config.fontFamily || 'sans-serif');
  const fontWeight = $derived(config.fontWeight || 'normal');

  function wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      // Rough estimate: average character width is fontSize * 0.6
      const estimatedWidth = testLine.length * fontSize * 0.6;

      if (estimatedWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return config.maxLines ? lines.slice(0, config.maxLines) : lines;
  }

  const lines = $derived(wrapText(config.content, size.width - 10));
  const lineHeight = $derived(fontSize * 1.2);

  function getTextAnchor(align: string): string {
    switch (align) {
      case 'left':
        return 'start';
      case 'right':
        return 'end';
      case 'center':
      default:
        return 'middle';
    }
  }

  function getX(align: string): number {
    switch (align) {
      case 'left':
        return position.x + 5;
      case 'right':
        return position.x + size.width - 5;
      case 'center':
      default:
        return position.x + size.width / 2;
    }
  }
</script>

{#each lines as line, i}
  <text
    x={getX(config.align)}
    y={position.y + fontSize + i * lineHeight}
    text-anchor={getTextAnchor(config.align)}
    fill={config.color}
    font-size={fontSize}
    font-family={fontFamily}
    font-weight={fontWeight}
  >
    {line}
  </text>
{/each}
