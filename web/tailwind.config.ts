import type { Config } from 'tailwindcss';

const config: Config = {
  daisyui: {
    themes: ['light'],
  },
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/line-clamp')],
};

export default config;
