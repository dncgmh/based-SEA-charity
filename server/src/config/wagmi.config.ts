import { http, createConfig } from '@wagmi/core';
import { base, baseSepolia } from '@wagmi/core/chains';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
