/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink:     '#0A0A0A',
        cream:   '#F5F2ED',
        warm:    '#EAE6DF',
        muted:   '#9A9490',
        border:  '#DDD9D3',
        accent:  '#1A1A1A',
        gold:    '#C4A35A',
        ok:      '#2D6A4F',
        warn:    '#9B4819',
        danger:  '#8B1A1A',
      },
      fontSize: {
        '2xs': ['10px', { letterSpacing: '0.08em' }],
      },
      animation: {
        'fade-up':   'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-in':  'slideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp:  { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { from: { opacity:'0' }, to: { opacity:'1' } },
        slideIn: { from: { opacity:'0', transform:'translateX(-12px)' }, to: { opacity:'1', transform:'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
