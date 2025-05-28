
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
    

```