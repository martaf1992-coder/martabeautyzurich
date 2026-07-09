import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — derived from Logo.jpeg
        parchment: '#F0EBE3',      // warm parchment — hero sections
        'bg-muted': '#FAF8F5',     // slightly warm white — alternating sections
        ink: '#1A1A1A',            // near-black — headings, body text
        secondary: '#6B6560',      // warm gray — captions, metadata
        accent: '#C9A0A0',         // dusty rose — CTAs, active states
        'accent-hover': '#B08888', // darker rose — hover
        border: '#E5E0DA',         // barely-there warm border
        // Tier tints — program cards
        'tier-essential': '#F5F3EF',
        'tier-integrated': '#EDF5F0',
        'tier-luxury': '#F0EDF5',
        'tier-mum': '#F5EDEB',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display sizes for hero headings
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.15' }],
      },
      borderRadius: {
        card: '14px',
      },
      borderWidth: {
        DEFAULT: '1px',
        thin: '0.5px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
