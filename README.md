# StackForge CLI 

> **The fastest way to bootstrap modern web development projects with pre-configured setups**

StackForge CLI is a powerful command-line tool that instantly scaffolds production-ready projects with your favorite tech stacks. Skip the tedious setup and jump straight into coding with pre-configured boilerplate code, routing, styling, and essential packages.

##  Features

-  **4 Popular Stack Options**: React (JS/TS) and Express (Prisma/Mongoose)
- **Lightning Fast Setup**: Get a complete project running in under 2 minutes
-  **Pre-configured Styling**: Tailwind CSS ready to go
-  **Built-in Routing**: React Router and Express routes already set up
-  **Authentication Boilerplate**: JWT auth patterns included
-  **Advanced Package Options**: Optional extras like WebSocket, Redis, Socket.IO
-  **Beautiful CLI Experience**: Interactive prompts with colorful feedback
-  **Smart Configuration**: Auto-generates .env files and project structure

##  Quick Start

### Installation

```bash
# Run directly with npx (recommended)
npx stackforge-cli

# Or install globally
npm install -g stackforge-cli
stackforge-cli
```

### Basic Usage

```bash
npx stackforge-cli
```

Follow the interactive prompts to:
1. Choose your tech stack
2. Name your project
3. Select additional packages (optional)

##  Available Stacks

| Stack | Description | Includes |
|-------|-------------|----------|
| **React + JS** | Modern React with JavaScript | Vite, React Router, Tailwind CSS, ESLint |
| **React + TS** | React with TypeScript | Vite, React Router, Tailwind CSS, TypeScript, ESLint |
| **Express + Prisma** | Node.js API with Prisma ORM | Express, Prisma, JWT Auth, CORS, Helmet |
| **Express + Mongoose** | Node.js API with MongoDB | Express, Mongoose, JWT Auth, CORS, Helmet |

##  CLI Parameters

### Core Flags

| Flag | Description | Example |
|------|-------------|---------|
| `-v, --verbose` | Show detailed output during installation | `npx stackforge-cli -v` |
| `-a, --advanced` | Enable advanced package selection | `npx stackforge-cli -a` |

### Advanced Mode Packages

When using the `-a` flag, you can select additional packages:

#### React Projects
- **WebSocket** - Real-time communication
- **@acernity/ui** - Beautiful UI components

#### Express Projects  
- **Redis** - In-memory data store and caching
- **Socket.IO** - Real-time bidirectional communication
- **Bull Queue** - Job queue system
- **Kafka** - Event streaming platform

### Examples

```bash
# Standard interactive setup
npx stackforge-cli

# Verbose mode (see all installation details)
npx stackforge-cli -v

# Advanced mode with extra packages
npx stackforge-cli -a

# Combine flags
npx stackforge-cli -v -a
```

##  Project Structure

### React Projects
```
my-react-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
├── public/
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### Express Projects
```
my-express-app/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── prisma/ (if Prisma)
├── .env
└── package.json
```

##  What You Get Out of the Box

### Frontend (React)
-  **Vite** for lightning-fast development
-  **Tailwind CSS** with custom configuration
-  **React Router** with example routes
-  **ESLint** with sensible defaults
-  **Responsive** design patterns
-  **Component** library structure

### Backend (Express)
-  **JWT Authentication** with refresh tokens
-  **Security Middleware** (Helmet, CORS)
-  **Database Models** and schemas
-  **RESTful API** routes structure
-  **Error Handling** middleware
-  **Request Validation** setup

### Environment Setup
-  **Environment Variables** auto-configured
-  **.gitignore** with sensible defaults
-  **Package Scripts** for development and production
-  **Development Workflow** ready

##  Getting Started After Installation

### React Projects
```bash
cd your-project-name
npm run dev
```
Your React app will be running on `http://localhost:5173`

### Express Projects
```bash
cd your-project-name

# For Prisma projects
npx prisma migrate dev --name init
npx prisma generate

# Start development server
npm run dev
```
Your API will be running on `http://localhost:8000`

##  Customization

All projects come with sensible defaults but are fully customizable:

- **Tailwind CSS**: Modify `tailwind.config.js` for your design system
- **ESLint**: Adjust rules in `.eslintrc.js`
- **Vite**: Configure build options in `vite.config.js`
- **Database**: Update Prisma schema or Mongoose models as needed

##  Contributing

We welcome contributions! If you'd like to add new stacks or improve existing ones:

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

##  License

MIT License - feel free to use this in your projects!

##  Support

Having issues? Found a bug? 
- Open an issue on [GitHub](https://github.com/RajanDhamala/stackforge-cli)
- Check our documentation
- Ask questions in discussions

---

**Happy coding! 🎉** 

*Built with  to save developers time and get you building faster.*
