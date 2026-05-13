# SPTTS — Frontend

React-based dashboard for the Smart Public Transport Tracking System.

## Tech

React 19, Vite 7, MUI 7, Recharts, Leaflet, STOMP.js

## Pages

| Route                  | Page               | Role(s)       |
|------------------------|--------------------|---------------|
| `/login`               | Login              | Public        |
| `/register`            | Register           | Public        |
| `/`                    | Home               | All           |
| `/profile`             | Profile            | All           |
| `/operator/dashboard`  | Operator Dashboard | BUS_OPERATOR  |
| `/operator/trips`      | Operator Trips     | BUS_OPERATOR  |
| `/admin/dashboard`     | Admin Dashboard    | SYSTEM_ADMIN  |
| `/admin/users`         | User Management    | SYSTEM_ADMIN  |
| `/admin/routes`        | Route Management   | SYSTEM_ADMIN  |
| `/admin/reports`       | System Reports     | SYSTEM_ADMIN  |
| `/admin/fleet`         | Fleet Management   | SYSTEM_ADMIN  |
| `/admin/fares`         | Fare Management    | SYSTEM_ADMIN  |
| `/admin/create-route`  | Create Route       | SYSTEM_ADMIN  |
| `/rura/dashboard`      | RURA Dashboard     | RURA          |
| `/rura/reports`        | RURA Reports       | RURA          |
| `/rura/incidents`      | Review Incidents   | RURA          |

## Dev

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. API requests proxy to `http://localhost:8080`.

## Build

```bash
npm run build
```

Output in `dist/`.
