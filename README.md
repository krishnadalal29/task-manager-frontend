# Task Manager Frontend

A modern React-based frontend application for managing tasks, built with authentication, tag management, and a clean UI using Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, read, update, and delete tasks
- **Tag Management**: Organize tasks with customizable tags
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **API Integration**: Communicates with backend API using Axios

## Technologies Used

- **React**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Testing Library**: Testing utilities
- **Create React App**: Build tool

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (irreversible)

## Docker

To run the application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t task-manager-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 task-manager-frontend
   ```

## Project Structure

```
src/
├── api/                 # API client configuration
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Header, Footer)
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   ├── tags/           # Tag management feature
│   └── tasks/          # Task management feature
├── hooks/              # Custom React hooks
└── styles/             # CSS and styling files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

This project is licensed under the MIT License.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
