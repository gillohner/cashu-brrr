/**
 * Cashu Domain Type Definitions
 * Extended types for Cashu operations
 */

import type { CashuWallet, MintQuoteResponse, Proof } from '@cashu/cashu-ts';

export interface Mint {
  url: string;
  name?: string;
  description?: string;
  icon?: string;
  units?: string[];
  contacts?: MintContact[];
  motd?: string;
}

export interface MintContact {
  method: string;
  info: string;
}

export interface WalletState {
  wallet: CashuWallet | null;
  mint: Mint | null;
  isConnecting: boolean;
  error: Error | null;
}

export interface PaymentState {
  quote: MintQuoteResponse | null;
  isPaying: boolean;
  error: Error | null;
}

export interface TokenGenerationRequest {
  amount: number;
  quantity: number;
  unit: string;
  mintUrl: string;
}

export interface TokenGenerationResult {
  tokens: Proof[][];
  totalAmount: number;
  mintUrl: string;
}

export type PaymentMethod = 'lightning' | 'ecash';

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  quote?: MintQuoteResponse;
}
