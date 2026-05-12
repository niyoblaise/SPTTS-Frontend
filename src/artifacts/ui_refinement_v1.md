# UI Refinement and Passenger Dashboard Enhancement

## Overview
This update focuses on refining the visual aesthetics of the authentication pages (Login and Register) and enhancing the Passenger Dashboard (Home) to align with a premium, modern dark theme using glassmorphism and animated elements.

## Changes

### 1. Login Page (`Login.jsx`)
- **Visual Overhaul**: Applied a deep navy background (`#0F172A`) with animated radial gradients (purple and teal) for a dynamic effect.
- **Glassmorphism**: Implemented a glassmorphism container for the login form and branding section, featuring a blurred backdrop, subtle borders, and semi-transparent backgrounds.
- **Branding Section**: Added a dedicated left-side branding section with a gradient background, large icon, and descriptive text to enhance brand identity.
- **Form Styling**: Styled input fields with rounded corners and subtle hover/focus effects. The "Sign In" button now features a gradient background and hover animations.
- **Code Cleanup**: Resolved syntax errors and removed duplicated code blocks to ensure a clean and maintainable codebase.

### 2. Register Page (`Register.jsx`)
- **Consistent Design**: Aligned the design with the Login page, using a similar layout and color palette but with distinct gradient variations (teal/green) for visual differentiation.
- **Feature Highlights**: Added a feature list (Real-time Tracking, Smart Scheduling, Easy Payments) in the branding section to showcase app benefits during registration.
- **Form Enhancements**: Styled all registration fields (Full Name, Email, Phone, Password, User Type) for better usability and aesthetics.
- **Code Cleanup**: Fixed syntax errors and duplication issues.

### 3. Passenger Dashboard (`Home.jsx`)
- **Premium Dashboard**: Transformed the simple home page into a premium dashboard with a "Hello, User!" greeting and a "Where would you like to go today?" prompt.
- **Interactive Cards**: The action cards (Request a Bus, Trip History, Notifications) now feature glassmorphism styling, hover lift effects, and glowing borders.
- **Animations**: Added background floating animations and smooth transitions for interactive elements.
- **Responsive Layout**: Ensure the dashboard looks great on all screen sizes.

### 4. Global Styles (`index.css`)
- **Animations**: Added `@keyframes float` to support the floating background animations used across the updated pages.

## Verification
- **Build Status**: The code has been cleaned up to resolve syntax errors that were previously causing build issues.
- **Visual Inspection**: The pages should now render with the intended premium dark theme and animations.
