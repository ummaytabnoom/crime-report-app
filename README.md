# Crime Report Frontend

Minimal Expo + React Native + Expo Router + React Native Paper frontend for the Crime Report API.

## Requirements

- Node.js 22+ for Expo SDK 57
- Expo Go or an Android/iOS development environment
- Crime Report backend running

Expo SDK 57 uses React Native 0.86 and React 19.2.

## Setup

```bash
npm install
```

Create `.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000/api
```

For a physical phone, do NOT use `localhost`. Use your computer's LAN IP, for example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api
```

For an Android emulator, `10.0.2.2` normally points to the host machine:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

Then:

```bash
npx expo start --clear
```

## Project structure

```text
app/
├── _layout.tsx
├── index.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
└── (app)/
    ├── _layout.tsx
    ├── home.tsx
    ├── report.tsx
    ├── my-reports.tsx
    ├── global.tsx
    ├── profile.tsx
    ├── crime/
    │   └── [id].tsx
    ├── police/
    │   ├── _layout.tsx
    │   └── index.tsx
    └── admin/
        ├── _layout.tsx
        ├── index.tsx
        ├── reports.tsx
        └── users.tsx

src/
├── api.ts
├── types.ts
├── storage.ts
├── theme.ts
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useApiList.ts
└── components/
    ├── AppHeader.tsx
    ├── CrimeCard.tsx
    ├── EmptyState.tsx
    ├── ErrorBox.tsx
    ├── Loading.tsx
    ├── RoleBadge.tsx
    └── Screen.tsx
```

## Theme

The app automatically follows the device light/dark mode using React Native Paper.

## Authentication model

This frontend does not create JWTs or tokens.

After login, it stores the returned user ID locally and sends:

```http
x-user-id: USER_ID
```

to protected backend routes.

This matches the current simple backend architecture.

## Important backend role names

Roles are lowercase:

```text
public
police
admin
```

## Current frontend features

### Public

- Login
- Registration
- Police registration with police ID
- Home
- Create crime report
- My reports
- Public accepted reports
- Report details
- Profile
- Sign out

### Police

- Police workspace
- Pending report queue
- Change report status:
  - Pending
  - Accepted
  - Under Investigation

### Admin

- Admin workspace
- Pending reports
- Accept reports
- User list
- Change user role
- Delete users

The frontend intentionally avoids Redux, Zustand, React Query, Axios, complex service abstractions, or a large navigation system.
