import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // BIT 企业级色彩系统 - 基于 IBM Carbon 和 Microsoft Fluent UI
      colors: {
        bit: {
          // 深蓝色主色调
          'deep-blue': '#1E293B',
          'navy-blue': '#1E40AF', 
          'ocean-blue': '#1D4ED8',
          'steel-blue': '#3B82F6',
          'light-blue': '#60A5FA',
          'sky-blue': '#93C5FD',
          'powder-blue': '#DBEAFE',
          
          // 文字色彩
          'text-primary': '#F8FAFC',
          'text-secondary': '#CBD5E1',
          'text-tertiary': '#94A3B8',
          'text-inverse': '#0F172A',
          'text-blue': '#FFFFFF',
          
          // 背景色彩
          'bg-primary': '#F8FAFC',
          'bg-secondary': '#F1F5F9',
          'bg-elevated': '#FFFFFF',
          'bg-glass': 'rgba(248, 250, 252, 0.95)',
          
          // 边框色彩
          'border-light': '#E2E8F0',
          'border-medium': '#CBD5E1',
          'border-strong': '#94A3B8',
          'border-focus': '#3B82F6',
          
          // 状态色彩
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
          'info': '#3B82F6',
        }
      },
      
      // 字体家族
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      
      // 阴影系统
      boxShadow: {
        'bit-sm': '0 2px 8px rgba(15, 23, 42, 0.08)',
        'bit-md': '0 4px 16px rgba(15, 23, 42, 0.12)',
        'bit-lg': '0 8px 32px rgba(15, 23, 42, 0.16)',
        'bit-xl': '0 16px 64px rgba(15, 23, 42, 0.20)',
        'bit-2xl': '0 32px 128px rgba(15, 23, 42, 0.24)',
        'bit-glass': '0 8px 32px rgba(59, 130, 246, 0.12)',
        'bit-focus': '0 0 0 3px rgba(59, 130, 246, 0.12)',
      },
      
      // 圆角系统
      borderRadius: {
        'bit-sm': '0.375rem',
        'bit-md': '0.5rem', 
        'bit-lg': '0.75rem',
        'bit-xl': '1rem',
        'bit-2xl': '1.5rem',
        'bit-3xl': '2rem',
        'bit-full': '9999px',
      },
      
      // 间距系统
      spacing: {
        'bit-xs': '0.25rem',
        'bit-sm': '0.5rem',
        'bit-md': '1rem',
        'bit-lg': '1.5rem',
        'bit-xl': '2rem',
        'bit-2xl': '3rem',
        'bit-3xl': '4rem',
        'bit-4xl': '6rem',
        'bit-5xl': '8rem',
      },
      
      // 动画和过渡
      transitionDuration: {
        'bit-fast': '150ms',
        'bit-normal': '300ms',
        'bit-slow': '500ms',
      },
      
      transitionTimingFunction: {
        'bit-ease': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'bit-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      
      // 自定义动画
      animation: {
        'bit-fade-in': 'bitFadeIn 0.6s ease-out',
        'bit-slide-up': 'bitSlideUp 0.6s ease-out',
        'bit-shimmer': 'bitShimmer 2s infinite',
      },
      
      keyframes: {
        bitFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bitSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bitShimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      
      // 背景渐变
      backgroundImage: {
        'bit-gradient-blue': 'linear-gradient(135deg, #1E293B 0%, #1E40AF 50%, #1D4ED8 100%)',
        'bit-gradient-glass': 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',
        'bit-gradient-text': 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
      },
      
      // 模糊效果
      backdropBlur: {
        'bit-sm': '8px',
        'bit-md': '12px',
        'bit-lg': '16px',
        'bit-xl': '20px',
        'bit-2xl': '24px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // 自定义组件插件
    function({ addComponents, theme }: any) {
      addComponents({
        // BIT 按钮系统
        '.bit-btn': {
          '@apply inline-flex items-center justify-center gap-2 px-6 py-3 font-inter font-semibold text-sm rounded-bit-lg border-0 cursor-pointer transition-all duration-bit-normal ease-bit-ease relative overflow-hidden whitespace-nowrap': {},
          '&:focus-visible': {
            '@apply outline-none shadow-bit-focus': {},
          },
        },
        '.bit-btn-primary': {
          '@apply bg-gradient-to-r from-bit-ocean-blue to-bit-steel-blue text-bit-text-blue shadow-bit-md': {},
          '&:hover': {
            '@apply -translate-y-0.5 shadow-bit-lg bg-gradient-to-r from-blue-600 to-bit-ocean-blue': {},
          },
          '&:active': {
            '@apply translate-y-0 shadow-bit-sm': {},
          },
        },
        '.bit-btn-secondary': {
          '@apply bg-bit-bg-elevated text-bit-text-primary border border-bit-border-medium shadow-bit-sm backdrop-blur-bit-sm': {},
          '&:hover': {
            '@apply bg-bit-bg-glass border-bit-steel-blue text-bit-steel-blue -translate-y-0.5 shadow-bit-md': {},
          },
        },
        '.bit-btn-ghost': {
          '@apply bg-transparent text-bit-text-secondary border border-transparent': {},
          '&:hover': {
            '@apply bg-white/10 text-bit-text-primary border-bit-border-light': {},
          },
        },
        '.bit-btn-small': {
          '@apply px-4 py-2 text-xs': {},
        },
        '.bit-btn-large': {
          '@apply px-8 py-4 text-base': {},
        },
        
        // BIT 卡片系统
        '.bit-card': {
          '@apply bg-bit-bg-elevated border border-bit-border-light rounded-bit-2xl shadow-bit-sm transition-all duration-bit-normal relative overflow-hidden': {},
          '&:hover': {
            '@apply -translate-y-1 shadow-bit-lg border-bit-border-medium': {},
          },
          '&::before': {
            content: '""',
            '@apply absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bit-steel-blue to-transparent opacity-0 transition-opacity duration-bit-normal': {},
          },
          '&:hover::before': {
            '@apply opacity-60': {},
          },
        },
        '.bit-card-glass': {
          '@apply bg-bit-bg-glass backdrop-blur-bit-xl border-white/10': {},
        },
        
        // BIT 输入系统
        '.bit-input': {
          '@apply w-full px-4 py-3.5 font-inter text-sm font-normal text-bit-text-primary bg-bit-bg-primary border border-bit-border-light rounded-bit-lg transition-all duration-bit-normal outline-none': {},
          '&::placeholder': {
            '@apply text-bit-text-tertiary font-normal': {},
          },
          '&:focus': {
            '@apply border-bit-border-focus shadow-bit-focus bg-bit-bg-elevated': {},
          },
          '&:hover:not(:focus)': {
            '@apply border-bit-border-medium': {},
          },
        },
        
        // BIT 文字系统  
        '.bit-text-display': {
          '@apply font-inter text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight': {},
        },
        '.bit-text-heading-1': {
          '@apply font-inter text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight': {},
        },
        '.bit-text-heading-2': {
          '@apply font-inter text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug tracking-tight': {},
        },
        '.bit-text-heading-3': {
          '@apply font-inter text-xl md:text-2xl font-semibold leading-snug': {},
        },
        '.bit-text-body-large': {
          '@apply font-inter text-lg font-normal leading-relaxed': {},
        },
        '.bit-text-body': {
          '@apply font-inter text-base font-normal leading-relaxed': {},
        },
        '.bit-text-body-small': {
          '@apply font-inter text-sm font-normal leading-normal': {},
        },
        '.bit-text-caption': {
          '@apply font-inter text-xs font-medium leading-tight uppercase tracking-wider': {},
        },
        '.bit-text-code': {
          '@apply font-jetbrains text-sm font-medium tracking-wide': {},
        },
        '.bit-text-gradient': {
          '@apply bg-bit-gradient-text bg-clip-text text-transparent': {},
        },
        
        // BIT 布局系统
        '.bit-container': {
          '@apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        '.bit-container-wide': {
          '@apply max-w-screen-2xl': {},
        },
        '.bit-section': {
          '@apply py-16 md:py-20 lg:py-24': {},
        },
        '.bit-section-small': {
          '@apply py-8 md:py-12 lg:py-16': {},
        },
        
        // BIT 工具类
        '.bit-glass-effect': {
          '@apply bg-bit-bg-glass backdrop-blur-bit-xl': {},
        },
        '.bit-animate-fade-in': {
          '@apply animate-bit-fade-in': {},
        },
        '.bit-animate-slide-up': {
          '@apply animate-bit-slide-up': {},
        },
      })
    }
  ],
};

export default config;