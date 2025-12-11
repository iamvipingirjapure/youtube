/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                yt: {
                    base: "#ffffff",
                    text: "#0f0f0f",
                    secondary: "#606060",
                    hover: "#f2f2f2",
                    border: "#e5e5e5",
                    red: "#ff0000"
                }
            }
        },
    },
    plugins: [],
}
