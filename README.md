# Pet Owner Social Media

A social media platform for pet owners to connect, share posts, and interact with other pet lovers. This project is built using **React** (with TypeScript) for the frontend and **NestJS** for the backend.

## Features

- **User Authentication**: Register, login, and manage user profiles.
- **Post Creation**: Create and share posts with media (images/videos).
- **Commenting**: Add and manage comments on posts.
- **Pet Management**: Add, edit, and remove pets in user profiles.
- **Friendship System**: Send, accept, and reject friend requests.
- **Group Creation**: Create and join groups related to pets.
- **Private Messaging**: Send and receive messages between users.
- **Reporting**: Report inappropriate content or behavior.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Redux**: For state management.
- **Axios**: For making HTTP requests to the backend.
- **React Router**: For navigation between pages.
- **date-fns**: For date manipulation and formatting.
- **Socket.IO**: For WebSocket communication in private messaging.
- **Tailwind CSS**: A utility-first CSS framework for styling the frontend.

### Backend

- **NestJS**: A framework for building scalable and maintainable server-side applications.
- **TypeORM**: For database interaction.
- **PostgreSQL**: Used as the database for storing user, post, and pet data.
- **JWT (JSON Web Tokens)**: For user authentication and authorization.
- **Socket.IO**: For WebSocket communication in private messaging.

## Installation

### Backend (NestJS)

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/pet-owner-social-media.git
    cd pet-owner-social-media
    ```

2. Navigate to the server directory:

    ```bash
    cd server
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the `server` directory and configure the following environment variables:

    ```bash
    DATABASE_URL=your-database-connection-string
    JWT_ACCESS_SECRET=your-jwt-secret
    ```

5. Run the backend server:

    ```bash
    npm run start:dev
    ```

### Frontend (React + TypeScript)

1. Navigate to the client directory:

    ```bash
    cd client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the frontend application:

    ```bash
    npm start
    ```

4. Visit `http://localhost:3000` in your browser.

## Usage

- Once both the frontend (`client`) and backend (`server`) servers are running, you can start interacting with the app by registering as a new user, adding pets to your profile, creating posts, commenting, and connecting with other pet owners.
- You can also create and join groups, send friend requests, and report inappropriate content,...

