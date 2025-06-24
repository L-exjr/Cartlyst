# Cartlyst

Cartlyst is a modern e-commerce mobile application built with React Native (Expo) and Spring Boot, offering a seamless shopping experience with a comprehensive backend API.

## 🚀 Features

### Frontend (React Native + Expo)

- **Modern UI/UX**: Clean, intuitive interface with tab-based navigation
- **Authentication System**: Complete sign-in, sign-up, and password reset flow
- **Product Management**: Browse products by categories with search functionality
- **Shopping Cart**: Add, remove, and manage items in cart
- **Wishlist**: Save favorite products for later
- **User Account**: Profile management and account settings
- **Cross-platform**: Works on iOS, Android, and Web
- **Image Handling**: Profile picture upload and product image display

### Backend (Spring Boot)

- **RESTful API**: Comprehensive backend services
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL with JPA/Hibernate
- **Email Service**: Password reset and verification emails
- **Data Persistence**: Robust data management with Spring Data JPA

## 🛠 Tech Stack

### Frontend

- **React Native** (0.79.4) - Cross-platform mobile development
- **Expo** (^53.0.12) - Development platform and tools
- **Expo Router** (^5.1.0) - File-based routing
- **Zustand** (^5.0.5) - State management
- **Expo Secure Store** - Secure data storage
- **Expo Image Picker** - Image selection and upload
- **React Native Screens** - Native navigation components

### Backend

- **Spring Boot** (3.5.3) - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **Spring Mail** - Email services
- **PostgreSQL** - Database
- **Lombok** - Code generation
- **Java 17** - Runtime environment

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Babel** - JavaScript transpilation
- **Gradle** - Build tool (Backend)

## 📱 App Structure

```
Cartlyst/
├── src/
│   ├── app/                    # Expo Router app directory
│   │   ├── _layout.js         # Root layout with authentication
│   │   ├── (tabs)/            # Tab-based navigation
│   │   │   ├── (1-home)/      # Home screen
│   │   │   ├── (2-categories)/ # Categories screen
│   │   │   ├── (3-cart)/      # Shopping cart
│   │   │   ├── (4-wishlist)/  # Wishlist
│   │   │   └── (5-account)/   # User account
│   │   ├── sign-in.js         # Sign in screen
│   │   ├── sign-up.js         # Sign up screen
│   │   ├── reset-password.js  # Password reset
│   │   └── verification.js    # Email verification
│   ├── components/            # Reusable UI components
│   │   ├── CarouselCard.js
│   │   ├── CategoryCards.js
│   │   ├── CategoryCircles.js
│   │   ├── ProductCard.js
│   │   └── SearchBar.js
│   └── utils/                 # Utility functions
│       ├── authStore.js       # Authentication state management
│       └── config.js          # App configuration
├── backend/                   # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/cartlyst/backend/
│   │       └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── build.gradle
├── assets/                    # Static assets
├── app.json                   # Expo configuration
└── package.json              # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (Latest LTS version)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Java 17** (for backend)
- **PostgreSQL** (for database)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)

### Frontend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cartlyst.git
   cd cartlyst
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint:**
   Edit `src/utils/config.js` and update the `API_BASE_URL` to point to your backend server.

4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Configure database:**
   Update `src/main/resources/application.properties` with your PostgreSQL credentials:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/cartlyst
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the backend:**
   ```bash
   ./gradlew bootRun
   # or on Windows
   gradlew.bat bootRun
   ```

## 📱 Available Scripts

### Frontend

- `npm start` - Starts the Expo development server
- `npm run ios` - Runs the app on iOS simulator
- `npm run android` - Runs the app on Android emulator
- `npm run web` - Runs the app in web browser
- `npm run lint` - Runs ESLint for code linting
- `npm run format` - Formats code with Prettier

### Backend

- `./gradlew bootRun` - Runs the Spring Boot application
- `./gradlew build` - Builds the application
- `./gradlew test` - Runs tests

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
API_BASE_URL=http://localhost:8080/api
```

### Database Setup

1. Install PostgreSQL
2. Create a database named `cartlyst`
3. Update the database configuration in `backend/src/main/resources/application.properties`

## 📱 App Screenshots

The app features a modern tab-based interface with:

- **Home**: Featured products and promotions
- **Categories**: Browse products by category
- **Cart**: Shopping cart management
- **Wishlist**: Saved favorite products
- **Account**: User profile and settings

## 🔐 Authentication Flow

The app implements a comprehensive authentication system:

1. **Sign In**: Email/password authentication
2. **Sign Up**: New user registration with email verification
3. **Password Reset**: Secure password recovery via email
4. **Guest Mode**: Browse without account creation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce features
  - React Native frontend with Expo
  - Spring Boot backend API
  - Authentication system
  - Product browsing and cart functionality

---

**Built with ❤️ using React Native, Expo, and Spring Boot**
