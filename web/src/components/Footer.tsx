'use client';

import { DISCORD_LINK, FIGMA_LINK, GITHUB_LINK, ONCHAINKIT_LINK, TWITTER_LINK } from 'src/links';

const _docLinks = [
  { href: ONCHAINKIT_LINK, title: 'Docs' },
  { href: GITHUB_LINK, title: 'Github' },
  { href: DISCORD_LINK, title: 'Discord' },
  { href: FIGMA_LINK, title: 'Figma' },
  { href: TWITTER_LINK, title: 'X' },
];

export default function Footer() {
  return (
    <footer className="footer footer-center bg-info p-10 text-info-content">
      <div>
        <p className="font-bold text-2xl">Based SEA Charity</p>
        <p>Empowering global giving since 2024</p>
        <p>Powered by Base</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a href="https://www.base.org/names" target="_blank" className="link link-hover" rel="noreferrer">
            Onchain Identity
          </a>
          <a href="https://keys.coinbase.com/" target="_blank" rel="noreferrer" className="link link-hover">
            Smart Wallet
          </a>
          <a href="https://wallet.coinbase.com/" target="_blank" rel="noreferrer" className="link link-hover">
            Coinbase Wallet
          </a>
          <a href="https://basescan.org/" target="_blank" rel="noreferrer" className="link link-hover">
            Base Explorer
          </a>
        </div>
      </div>
    </footer>
  );
}
