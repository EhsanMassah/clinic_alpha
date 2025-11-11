module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          deep: 'rgb(var(--brand-deep) / <alpha-value>)',
          night: 'rgb(var(--brand-night) / <alpha-value>)',
          sky: 'rgb(var(--brand-sky) / <alpha-value>)',
          mist: 'rgb(var(--brand-mist) / <alpha-value>)',
          tint: 'rgb(var(--brand-tint) / <alpha-value>)',
        },
        cream: {
          DEFAULT: 'rgb(var(--cream) / <alpha-value>)',
          soft: 'rgb(var(--cream-soft) / <alpha-value>)',
          warm: 'rgb(var(--cream-warm) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          bold: 'rgb(var(--accent-bold) / <alpha-value>)',
        },
        neutral: {
          900: 'rgb(var(--neutral-900) / <alpha-value>)',
          700: 'rgb(var(--neutral-700) / <alpha-value>)',
          500: 'rgb(var(--neutral-500) / <alpha-value>)',
          300: 'rgb(var(--neutral-300) / <alpha-value>)',
          200: 'rgb(var(--neutral-200) / <alpha-value>)',
          100: 'rgb(var(--neutral-100) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Fraunces"', '"Playfair Display"', 'serif'],
        serif: ['"Fraunces"', '"Playfair Display"', 'serif'],
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 198, 255, 0)' },
          '50%': { boxShadow: '0 0 0 18px rgba(99, 198, 255, 0.16)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        rise: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        tilt: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '50%': { transform: 'rotateX(3deg) rotateY(-3deg)' },
          '100%': { transform: 'rotateX(0deg) rotateY(0deg)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        fadeIn: 'fadeIn 680ms cubic-bezier(0.16, 1, 0.3, 1) both',
        fadeInUp: 'fadeInUp 720ms cubic-bezier(0.16, 1, 0.3, 1) both',
        pulseGlow: 'pulseGlow 7s ease-in-out infinite',
        shimmer: 'shimmer 2.8s linear infinite',
        rise: 'rise 820ms cubic-bezier(0.16, 1, 0.3, 1) both',
        tilt: 'tilt 12s ease-in-out infinite',
      },
      boxShadow: {
        glass: '0 32px 76px rgba(10, 21, 45, 0.28)',
        glow: '0 26px 58px rgba(25, 76, 125, 0.26)',
        'glow-soft': '0 18px 46px rgba(16, 38, 74, 0.18)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 14% 20%, rgba(var(--brand-sky), 0.36), rgba(var(--brand-night), 0.04))',
        'hero-sheen':
          'linear-gradient(135deg, rgba(var(--brand-tint), 0.48) 0%, rgba(var(--accent-soft), 0.32) 55%, rgba(255, 255, 255, 0.82) 100%)',
        'surface-glow':
          'radial-gradient(circle at top, rgba(var(--brand-mist), 0.25), transparent 70%)',
        'grid-soft':
          'linear-gradient(transparent 96%, rgba(255, 255, 255, 0.08) 97%), linear-gradient(90deg, transparent 96%, rgba(255, 255, 255, 0.08) 97%)',
      },
    },
  },
  plugins: [],
}
