/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#e8f7ff",
                    100: "#c6eaff",
                    200: "#99d7ff",
                    300: "#61c0ff",
                    400: "#2ba7ff",
                    500: "#0d8ded",
                    600: "#0071c4",
                    700: "#005899",
                    800: "#044a80",
                    900: "#0a3f6b",
                    950: "#062844"
                }
            }
        }
    },
    plugins: []
};

