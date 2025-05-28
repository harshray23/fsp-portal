
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Security Note on Deployment

When deploying this application, ensure your hosting platform (e.g., Firebase Hosting, Vercel, Netlify) is configured to enforce **HTTPS**. Most modern platforms do this by default, providing SSL certificates automatically. HTTPS is crucial for encrypting data in transit and protecting user information.

## Development Best Practices for Security

To maintain a secure application, consider the following practices during development:

*   **Code Reviews**: Regularly have another developer review your code, especially for security-sensitive parts like authentication, authorization, and data handling.
*   **Security Scanning Tools**: Integrate Static Analysis Security Testing (SAST) tools into your development pipeline to automatically detect common vulnerabilities.
*   **Dependency Management**: Keep your project dependencies up-to-date and regularly audit them for known vulnerabilities (e.g., using `npm audit`).
*   **Input Validation**: Always validate and sanitize user input on both the client-side (as done with `zod` in forms) and server-side (for API routes/actions) to prevent injection attacks (XSS, SQL injection, etc.).
*   **Principle of Least Privilege**: Ensure components and users only have the permissions necessary to perform their tasks. Use robust authorization mechanisms like Firebase Custom Claims for role-based access control.
*   **Secure Defaults**: Configure services and libraries with security in mind from the start.
*   **Environment Variables**: Store all secrets (API keys, database credentials, JWT secrets) in environment variables (`.env.local` for development, and configured securely in your deployment environment). Do not commit these to your Git repository.
*   **HttpOnly Cookies for Sessions**: For production, store session tokens in server-set `HttpOnly`, `Secure`, `SameSite` cookies to protect against XSS.
*   **Rate Limiting & CAPTCHA**: Implement rate limiting and CAPTCHA on login and other sensitive endpoints to prevent brute-force attacks.
*   **Content Security Policy (CSP)**: Configure a strong CSP to mitigate XSS and other injection attacks. The current `next.config.js` provides a basic CSP.
*   **Firestore Security Rules**: If using Firestore, implement robust security rules to control data access at the database level. Start with a "deny all" default and explicitly grant permissions as needed.
*   **Error Logging**: Integrate a service like Sentry to track and monitor errors in production. Ensure your Sentry DSN is stored securely as an environment variable.
    

```
```
  </change>
  <change>
    <file>/package.json</file>
    <content><![CDATA[
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/googleai": "^1.8.0",
    "@genkit-ai/next": "^1.8.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@sentry/nextjs": "^8.21.0",
    "@tanstack-query-firebase/react": "^1.0.5",
    "@tanstack/react-query": "^5.66.0",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "firebase": "^11.3.0",
    "genkit": "^1.8.0",
    "js-cookie": "^3.0.5",
    "lucide-react": "^0.475.0",
    "next": "15.2.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.8.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "5.8.3"
  }
}
