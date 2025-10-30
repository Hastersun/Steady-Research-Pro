# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Steady Research Pro seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **GitHub Security Advisories** - Go to the [Security tab](https://github.com/Hastersun/Steady-Research-Pro/security/advisories) and create a new draft security advisory
2. **Email** - Send details to the repository owner (check GitHub profile for contact info)

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Status Update**: Within 7 days with our evaluation
- **Fix Timeline**: Depends on severity and complexity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-60 days

## Security Best Practices

### For Users

1. **Keep Updated** - Always use the latest version
2. **API Keys** - Keep your API keys secure and never commit them to version control
3. **Local Ollama** - Use local Ollama for sensitive research topics
4. **HTTPS Only** - Always access the application via HTTPS in production
5. **Review Permissions** - Understand what permissions you're granting

### For Developers

1. **Dependencies** - Keep dependencies up to date
2. **Code Review** - All changes should be reviewed
3. **Input Validation** - Validate and sanitize all inputs
4. **Secrets Management** - Never commit secrets or API keys
5. **Security Headers** - Implement appropriate security headers
6. **CORS** - Configure CORS appropriately
7. **Rate Limiting** - Implement rate limiting on API endpoints

## Known Security Considerations

### API Keys Storage

API keys are stored in browser's localStorage. While this is convenient, users should be aware:

- Keys are accessible to JavaScript running on the same domain
- Keys persist across browser sessions
- Users should clear stored keys on shared computers

### Local Ollama Security

When using local Ollama:

- Ensure Ollama service is not exposed to the internet
- Use firewall rules to restrict access to localhost only
- Keep Ollama updated to the latest version

### Third-Party Services

When using cloud AI services:

- Data is transmitted to third-party APIs
- Review privacy policies of OpenAI, DeepSeek, Claude, etc.
- Consider data sensitivity before using cloud services

## Security Updates

We will:

- Announce security updates through GitHub Security Advisories
- Include security fixes in release notes
- Credit security researchers who report vulnerabilities (unless they wish to remain anonymous)

## Scope

The following are **in scope** for vulnerability reports:

- Server-side vulnerabilities in API endpoints
- Client-side vulnerabilities (XSS, CSRF, etc.)
- Authentication and authorization issues
- Data leakage or privacy issues
- Dependency vulnerabilities with direct impact

The following are **out of scope**:

- Social engineering attacks
- Physical attacks
- Attacks requiring physical access to user's device
- Denial of Service attacks
- Issues in third-party services (Ollama, OpenAI, etc.)
- Issues in outdated browsers or dependencies

## Contact

For any questions about this security policy, please open a GitHub Discussion or contact the maintainers.

## Attribution

This security policy is based on industry best practices and inspired by security policies from leading open-source projects.

---

Thank you for helping keep Steady Research Pro and its users safe!
