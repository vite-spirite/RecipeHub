import type { Config } from 'tailwindcss';

export default <Partial<Config>>({
    mode: 'jit',
    content: ['./src/**/*.{js,ts,jsx,tsx,vue,html}'],
    theme: {
        extend: {
            colors: {
                primary: '#FF6363',
                secondary: {
                    100: '#E2E2D5',
                    200: '#888883',
                },
            },
            fontFamily: {
                title: ['Montserrat', 'sans-serif'],
                primary: ['Hind Madurai', 'sans-serif'],
                secondary: ['Lora', 'sans-serif'],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
});