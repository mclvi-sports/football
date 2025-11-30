# Auth UI Implementation

**Workorder:** WO-AUTH-UI-001
**Status:** Complete
**Commit:** d82273d

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/auth` | `src/app/auth/page.tsx` | Main auth page with Sign In / Sign Up tabs |
| `/auth/forgot-password` | `src/app/auth/forgot-password/page.tsx` | Request password reset email |
| `/auth/check-email` | `src/app/auth/check-email/page.tsx` | Confirmation after reset request |
| `/auth/reset-password` | `src/app/auth/reset-password/page.tsx` | Enter new password (via email link) |

## File Structure

```
src/
├── app/auth/
│   ├── layout.tsx              # Shared layout with logo/branding
│   ├── page.tsx                # Tabbed Sign In / Sign Up
│   ├── forgot-password/
│   │   └── page.tsx            # Reset request form
│   ├── check-email/
│   │   └── page.tsx            # Email sent confirmation
│   └── reset-password/
│       └── page.tsx            # New password form
├── components/auth/
│   ├── sign-in-form.tsx        # Email/password sign in
│   ├── sign-up-form.tsx        # Registration with password confirm
│   └── password-strength.tsx   # Visual strength meter (4 bars)
└── lib/
    ├── validations/
    │   └── auth.ts             # Zod schemas for all forms
    └── supabase/
        └── auth.ts             # Auth wrapper functions
```

## Components

### SignInForm
- Email and password fields with validation
- "Forgot password?" link
- "Continue as Guest" link
- Loading and error states

### SignUpForm
- Email field
- Password with strength indicator
- Confirm password field
- Terms acceptance note
- Loading and error states

### PasswordStrength
- 4-bar visual meter
- Weak (red) / Medium (yellow) / Strong (green)
- Score based on length and character variety

## Validation Schemas

```typescript
// Sign In - email required, password required
signInSchema

// Sign Up - email, password (8+ chars, uppercase, lowercase, number), confirm match
signUpSchema

// Forgot Password - email only
forgotPasswordSchema

// Reset Password - same rules as sign up password
resetPasswordSchema
```

## Supabase Auth Functions

```typescript
signIn(email, password)       // Sign in with credentials
signUp(email, password)       // Create new account
signOut()                     // Sign out current user
resetPasswordForEmail(email)  // Send reset email
updatePassword(password)      // Set new password (after reset)
getSession()                  // Get current session
getUser()                     // Get current user
```

## User Flows

### Sign In Flow
1. User visits `/auth`
2. Enters email/password
3. On success → redirect to dashboard
4. On error → show error message

### Sign Up Flow
1. User visits `/auth` → clicks "Sign Up" tab
2. Enters email, password, confirm password
3. Password strength shown in real-time
4. On success → redirect to dashboard (or email confirmation)
5. On error → show error message

### Password Reset Flow
1. User clicks "Forgot password?" on sign in form
2. Redirects to `/auth/forgot-password`
3. Enters email → submits
4. Redirects to `/auth/check-email?email=...`
5. User clicks link in email
6. Lands on `/auth/reset-password`
7. Enters new password twice
8. On success → shows checkmark → redirects to `/auth`

## Design Notes

- Dark theme with blue gradient accents
- 400px max-width card layout
- Football emoji (🏈) as logo placeholder
- Consistent spacing and typography
- Mobile-responsive
- Accessible form labels and error messages

## Dependencies

- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod integration
- `zod` - Schema validation
- `@supabase/ssr` - Supabase client
- `shadcn/ui` - Button, Input, Label components

## Next Steps

- [ ] Add route protection middleware
- [ ] Implement email verification flow
- [ ] Add OAuth providers (Google, Discord)
- [ ] Add "Remember me" functionality
- [ ] Add rate limiting on auth endpoints
