# Better Auth State Mismatch Fix

This document describes the fix for the Better Auth "State Mismatch" error that was occurring during Google OAuth authentication.

## Error Description

The error manifested as:
```
ERROR [Better Auth]: State Mismatch. Verification not found { state: 'xO2FX7b3sCj74bXKwWdQgUQ2ILm2foAs' }
GET /api/auth/callback/google?state=...&code=... 302 in 7738ms
GET /api/auth/error?error=please_restart_the_process 200 in 44ms
```

## Root Cause

The issue was caused by incomplete Better Auth configuration, specifically:
1. Missing `baseURL` configuration
2. Missing `secret` configuration
3. Missing explicit `redirectURI` for Google OAuth
4. Missing `trustedOrigins` configuration
5. Inadequate session management settings

## Solution Implemented

### 1. Enhanced Better Auth Server Configuration (`/src/lib/auth.ts`)

Added comprehensive configuration:

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/google`,
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
  ],
})
```

### 2. Enhanced Client Configuration (`/src/lib/auth-client.ts`)

Added error handling:

```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  fetchOptions: {
    onError(e) {
      if (e.error.status === 401) {
        window.location.href = "/";
      }
    },
  },
})
```

### 3. Improved Sign-In Modal Error Handling

Enhanced the sign-in modal to:
- Display user-friendly error messages
- Handle authentication failures gracefully
- Provide retry functionality
- Clear error state on new attempts

## Key Configuration Changes

### Required Environment Variables

Ensure these environment variables are properly set:

```env
BETTER_AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

### Google Cloud Console Configuration

Make sure your Google OAuth app has the correct redirect URI configured:
- **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
- For production: `https://yourdomain.com/api/auth/callback/google`

## Configuration Explanations

### `baseURL`
- Ensures Better Auth knows the application's base URL
- Critical for generating correct callback URLs
- Must match the actual URL where the app is running

### `secret`
- Used for signing session tokens and state parameters
- Must be a secure, random string
- Generated using Better Auth's key generation tool

### `redirectURI`
- Explicitly defines where Google should redirect after authentication
- Must match exactly what's configured in Google Cloud Console
- Helps prevent state mismatch errors

### `trustedOrigins`
- Defines which origins are allowed to make auth requests
- Prevents CSRF attacks
- Includes both environment variable and fallback URLs

### Session Configuration
- `expiresIn`: How long sessions last (7 days)
- `updateAge`: How often to refresh session data (1 day)
- `cookieCache`: Improves performance by caching session data

## Testing the Fix

To verify the fix works:

1. **Clear browser data**: Clear cookies and localStorage
2. **Test sign-in flow**: Click "Sign In" and complete Google OAuth
3. **Check for errors**: Monitor browser console and network tab
4. **Verify session persistence**: Refresh page, ensure user stays logged in
5. **Test sign-out**: Ensure sign-out works properly

## Error Handling Improvements

The sign-in modal now:
- Shows specific error messages to users
- Handles network failures gracefully
- Allows users to retry without page refresh
- Clears previous errors on new attempts

## Prevention

To prevent similar issues in the future:

1. **Always configure `baseURL`** in Better Auth
2. **Use strong secrets** and store them securely
3. **Match redirect URIs** exactly between app and OAuth provider
4. **Test authentication** thoroughly in different environments
5. **Monitor auth errors** in production logs

## Troubleshooting

If the error persists:

1. **Check environment variables** are correctly set
2. **Verify Google OAuth configuration** matches redirect URIs
3. **Clear browser cache** completely
4. **Check network connectivity** and firewall settings
5. **Review Better Auth logs** for additional error details

## Production Deployment Notes

When deploying to production:

1. Update `NEXT_PUBLIC_APP_URL` to production URL
2. Add production redirect URI to Google OAuth app
3. Use secure, unique `BETTER_AUTH_SECRET`
4. Test authentication flow thoroughly
5. Monitor error logs for any auth issues

This fix resolves the state mismatch error and provides a robust, production-ready authentication system.