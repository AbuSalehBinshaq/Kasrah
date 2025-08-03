# Overview

This is a modern full-stack football (soccer) web application built with React, Express, and PostgreSQL. The application serves as a sports news platform focused on Saudi football, providing live match updates, transfer news, player statistics, and breaking news. It features a bilingual interface (Arabic/English) with real-time updates via WebSocket connections and a mobile-first responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom Saudi-themed color scheme (#C8102E primary color)
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Language Support**: Custom context-based internationalization supporting Arabic (RTL) and English (LTR)
- **Real-time Updates**: WebSocket integration for live match scores and breaking news

## Backend Architecture
- **Server Framework**: Express.js with TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with consistent error handling and logging middleware
- **Real-time Communication**: WebSocket server for broadcasting live updates to connected clients
- **Development**: Hot module replacement via Vite integration in development mode

## Database Schema
- **Teams**: Multi-language team names, logos, colors, and metadata
- **Players**: Player profiles with statistics, team associations, and market values
- **Matches**: Live match data with real-time score updates and status tracking
- **Transfers**: Transfer news with status tracking (rumor, confirmed, completed)
- **News**: Categorized news articles with view tracking and featured content
- **Users**: Basic user authentication system

## Mobile-First Design
- **Navigation**: Bottom navigation bar for mobile with traditional top navigation concepts
- **Responsive Layout**: Tailwind's responsive utilities ensure optimal display across devices
- **Touch Optimization**: Large touch targets and smooth animations for mobile interaction
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features

## Real-time Features
- **Live Scores**: WebSocket-powered live match score updates
- **Breaking News**: Real-time breaking news ticker with auto-refresh
- **Transfer Updates**: Instant transfer news notifications
- **Score Broadcasting**: Server broadcasts score changes to all connected clients

# External Dependencies

## Database
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

## UI and Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Google Fonts**: Cairo and Tajawal fonts for Arabic text, Inter for English

## Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds

## Real-time Communication
- **WebSocket (ws)**: Native WebSocket implementation for real-time updates
- **Custom WebSocket Hook**: Client-side WebSocket management with reconnection logic

## Query and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation for API schemas

## Authentication and Session Management
- **Express Session**: Session-based authentication
- **Connect PG Simple**: PostgreSQL session store for persistent sessions

## Deployment and Hosting
- **Replit Integration**: Optimized for Replit deployment with development tooling
- **Environment Variables**: Secure configuration management for database connections