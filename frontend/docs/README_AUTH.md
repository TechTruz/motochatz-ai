# 🔐 Motochatz AI - Authentication System

Complete authentication implementation using **TanStack Query** for API state management and **Zustand** for UI state management.

## 🚀 Quick Start

### 1. Environment Setup

Create `.env` in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test Authentication

1. Navigate to `http://localhost:5173/register`
2. Create an account
3. Login at `http://localhost:5173/login`
4. You'll be redirected to the dashboard

## 📖 Usage Guide

### Login

```tsx
import { useLogin } from "@/hooks/use-auth";

function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      email: "user@example.com",
      password: "Password123!!",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Register

```tsx
import { useRegister } from "@/hooks/use-auth";

function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register({
      email: "user@example.com",
      password: "Password123!!",
      repeatPassword: "Password123!!",
      firstName: "John",
      lastName: "Doe",
      garageName: "My Garage",
    });
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### Access User Data

```tsx
import { useAuthStore } from "@/stores/auth.store";

function UserProfile() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Login />;

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.email}</p>
      <p>Garage: {user?.garageName}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### Logout

```tsx
import { useLogout } from "@/hooks/use-auth";

function Header() {
  const logout = useLogout();

  return <button onClick={logout}>Logout</button>;
}
```

### Protected Routes

```tsx
import { Routes, Route } from "react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
```

## 🌐 API Endpoints

### POST /api/auth/register

Register a new user and create a garage.

**Request:**

```json
{
  "email": "johndoe@mail.co",
  "password": "Password123!!",
  "repeatPassword": "Password123!!",
  "firstName": "John",
  "lastName": "Doe",
  "garageName": "Bengkel Supraman"
}
```

**Response (201):**

```json
{
  "data": {
    "userId": "56fc40f9d735c28df206d078",
    "email": "johndoe@mail.co",
    "firstName": "John",
    "lastName": "Doe",
    "garageId": "56fc40f9d735c28df206d032",
    "garageName": "Bengkel Supraman",
    "createdAt": "2026-02-02T19:09:29.001Z",
    "updatedAt": "2026-02-02T19:09:29.001Z"
  }
}
```

### POST /api/auth/login

Login and receive authentication tokens.

**Request:**

```json
{
  "email": "johndoe@mail.co",
  "password": "Password123!!"
}
```

**Response (201):**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "4ab2f2db-669a-4e82-8116-39bc9a896061"
  }
}
```

**JWT Claims:**

```json
{
  "jti": "b6074eff-8c61-4763-869f-2a692eebdf9c",
  "sub": "69770964d6f4c7d7e8768bc3",
  "name": "John Doe",
  "role": "ADMIN",
  "garageId": "69770964d6f4c7d7e8768bc5",
  "garageName": "Bengkel Supraman",
  "iss": "http://localhost:3000",
  "aud": "*",
  "iat": 1769408892,
  "exp": 1769409792
}
```

## 🐛 Debugging

### Zustand State

```tsx
// In component or console
import { useAuthStore } from "@/stores/auth.store";
console.log(useAuthStore.getState());
```

### Check localStorage

```js
// In browser console
localStorage.getItem("motochatz-auth");
```

## 🤝 Contributing

When modifying authentication:

1. Update types in `auth.types.ts`
2. Add tests for new features
3. Update documentation
4. Follow existing patterns

## 📄 License

See LICENSE file in project root.

---

**Built with ❤️ for Motochatz AI**  
**Last Updated**: January 26, 2026
