<script lang="ts">
  import type { NoteTemplate, QRModuleConfig, DenominationModuleConfig, LogoModuleConfig, TextModuleConfig } from '@/types/design';
  import type { Token } from '@cashu/cashu-ts';
  import QRCodeModule from './base/QRCodeModule.svelte';
  import DenominationModule from './base/DenominationModule.svelte';
  import LogoModule from './base/LogoModule.svelte';
  import TextModule from './base/TextModule.svelte';
  import { getEncodedTokenV4 } from '@cashu/cashu-ts';
  import { secp256k1 } from '@noble/curves/secp256k1';
  import { bytesToHex } from '@noble/curves/abstract/utils';

  interface Props {
    template: NoteTemplate;
    token: Token | string;
    class?: string;
  }

  let { template, token, class: className = '' }: Props = $props();

  const randomId = bytesToHex(secp256k1.utils.randomPrivateKey()).slice(0, 12);
  const tokenString = $derived(
    typeof token === 'string' ? token : getEncodedTokenV4(token)
  );
  const denomination = $derived(
    typeof token === 'string'
      ? 0
      : token.proofs.reduce((sum, p) => sum + p.amount, 0)
  );

  // Sort modules by zIndex for proper layering
  const sortedModules = $derived(
    [...template.modules].sort((a, b) => a.zIndex - b.zIndex)
  );
</script>

<svg
  viewBox="0 0 {template.dimensions.width} {template.dimensions.height}"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
>
  {#each sortedModules as module (module.id)}
    {#if module.type === 'qr'}
      <QRCodeModule
        token={tokenString}
        config={module.config as QRModuleConfig}
        position={module.position}
        size={module.size}
        {randomId}
      />
    {:else if module.type === 'denomination'}
      <DenominationModule
        {denomination}
        config={module.config as DenominationModuleConfig}
        position={module.position}
        size={module.size}
      />
    {:else if module.type === 'logo'}
      <LogoModule
        config={module.config as LogoModuleConfig}
        position={module.position}
        size={module.size}
      />
    {:else if module.type === 'text'}
      <TextModule
        config={module.config as TextModuleConfig}
        position={module.position}
        size={module.size}
      />
    {/if}
  {/each}
</svg>
