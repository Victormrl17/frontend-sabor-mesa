/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(0, 80%, 55%)', // Rojo puro
        'primary-lightest': 'hsl(0, 100%, 89%)', // Rojo muy claro
        'primary-lighter': 'hsl(0, 100%, 77%)', // Rojo claro
        'primary-light': 'hsl(0, 100%, 59%)', // Rojo suave
        'primary-dark': 'hsl(0, 100%, 40%)', // Rojo oscuro
        'primary-darker': 'hsl(0, 100%, 30%)', // Rojo muy oscuro
        accent: 'hsl(37, 91%, 60%)', // Amarillo anaranjado vibrante (sin cambios)
        secondary: 'hsl(0, 0%, 95%)', // Gris claro
        success: 'hsl(145, 63%, 49%)', // Verde (éxito)
        warning: 'hsl(48, 89%, 50%)', // Amarillo (advertencia)
        danger: 'hsl(0, 100%, 50%)', // Rojo (peligro)
        'dark-secondary': 'hsl(217.2 32.6% 17.5%)', // Gris muy oscuro
        'dark-primary-foreground': 'hsl(222.2 47.4% 11.2%)', // Azul oscuro (sin cambios)
        'dark-card': 'hsl(222.2 84% 4.9%)' // Azul muy oscuro (sin cambios)
      },
      fontFamily: {
        title: ['Pally-Variable']
      },
      fontSize: {
        h1: '3.5rem',
        h2: '3rem',
        h3: '2.5rem',
        h4: '2rem',
        h5: '1.5rem',
        h6: '1.25rem'
      },
      lineHeight: {
        h1: '3.85rem',
        h2: '3.3rem',
        h3: '2.75rem',
        h4: '2.2rem',
        h5: '1.65rem',
        h6: '1.375rem'
      },
      width: {
        26: '6.5rem',
        27: '6.75rem',
        29: '7.25rem'
      },
      screens: {
        xs: '480px'
      }
    }
  },
  plugins: []
}
