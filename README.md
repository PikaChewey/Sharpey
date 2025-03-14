# Sharpes - Interactive Sharpe Ratio Game

A modern web application that helps users understand and optimize their investment portfolios using the Sharpe Ratio. Sharpes is an educational tool that gamifies the concept of risk-adjusted returns through an interactive interface.

![Sharpes Game Screenshot](https://via.placeholder.com/800x400?text=Sharpes+Game+Screenshot)

## Features

- **Portfolio Builder:** Create a two-stock portfolio and adjust weights using an intuitive slider
- **Sharpe Ratio Calculator:** Instantly calculate the Sharpe Ratio of your portfolio and individual stocks
- **Performance Visualization:** View 5-year performance charts of stocks and your portfolio
- **Market Comparison:** Compare your portfolio's Sharpe Ratio against major indices (S&P 500, NASDAQ, Dow Jones)
- **Leaderboard:** See the best-performing portfolios created by other users
- **Educational Content:** Learn about Sharpe Ratio and portfolio theory with an interactive tutorial
- **Responsive Design:** Fully optimized for both desktop and mobile devices
- **Dark Mode Support:** Toggle between light and dark themes based on preference
- **Interactive Tooltips:** Hover over metrics and concepts to get educational explanations
- **Advanced Metrics:** View additional performance indicators like Sortino Ratio and Beta

## Tech Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS, Chart.js, Framer Motion
- **Backend:** Node.js, Next.js
- **Package Management:** npm
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/sharpes.git
   cd sharpes
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```
npm run build
```

To start the production server:

```
npm start
```

## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project to Vercel
3. Vercel will automatically detect that it's a Next.js project and configure the build settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Educational Content

Sharpes includes comprehensive educational content to help users understand financial concepts:

1. **Interactive Tutorial:** A multi-step guide explaining the Sharpe Ratio, portfolio diversification, and how to use the application
2. **InfoTooltips:** Contextual explanations appear when hovering over various metrics and concepts
3. **Visual Indicators:** Color-coded ratings help users quickly understand if their portfolio is performing well
4. **Comparative Analysis:** See how your portfolio stacks up against market benchmarks

The application is designed to be educational while remaining engaging and interactive, making complex financial concepts accessible to beginners.

## UI Features

- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support:** Choose between light and dark themes based on preference or system settings
- **Animated Transitions:** Smooth animations enhance the user experience
- **Interactive Elements:** Sliders, toggles, and buttons provide an intuitive interface

## Acknowledgments

- [William F. Sharpe](https://en.wikipedia.org/wiki/William_F._Sharpe) for the development of the Sharpe Ratio
- [Chart.js](https://www.chartjs.org/) for the charting library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [Framer Motion](https://www.framer.com/motion/) for the animation library
- [React Icons](https://react-icons.github.io/react-icons/) for the icon library 