# SupportDesk

A full-stack support ticket management system built with ASP.NET Core and React. Enables customers to create tickets, agents to manage and respond to tickets, and administrators to oversee the entire support workflow with role-based access control, priority management, and automated email notifications.

### User info

user: admin@supportdesk.local
pass: Admin123!

user: agent1@supportdesk.local
pass: Agent123!

## Technologies

### Backend
- **ASP.NET Core 10** - Web API
- **Entity Framework Core 10** - ORM with PostgreSQL provider
- **PostgreSQL 18** - Database
- **ASP.NET Identity** - User authentication & authorization
- **JWT Bearer** - Token-based authentication
- **SMTP** - Email notifications

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Deployment
- **Nginx** - Reverse proxy & static file serving
- **systemd** - Process management
- **UFW** - Firewall
- **OpenSSL** - SSL/TLS certificates

## Architecture

### Clean Architecture (Backend)
```
backend/
├── SupportDesk.Api/          # Controllers, middleware, program entry
├── SupportDesk.Application/  # Services, DTOs, business logic
├── SupportDesk.Domain/        # Entities, enums, domain models
└── SupportDesk.Infrastructure/ # DbContext, migrations, data access
```

**Layer Dependencies:**
- **Domain** → No dependencies (core business models)
- **Application** → Domain (business logic & interfaces)
- **Infrastructure** → Domain, Application (data persistence)
- **API** → Application, Infrastructure (presentation layer)

### Frontend Structure
```
frontend/supportdesk-client/
├── src/
│   ├── api/           # HTTP client configuration
│   ├── auth/          # Auth context & protected routes
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route components
│   ├── App.jsx        # Router configuration
│   └── main.jsx       # Application entry
└── dist/              # Production build
```

### Database Schema
- **Users** (AspNetUsers) - Authentication & profiles
- **Roles** (AspNetRoles) - Admin, Agent roles
- **Tickets** - Support requests with status & priority
- **TicketReplies** - Public replies & internal notes

**Key Relationships:**
- Users → Tickets (creator & assigned agent)
- Tickets → TicketReplies (one-to-many)
- Users → TicketReplies (author)
