# AMAVIO Repository Security Boundary

This repository is private, but privacy is not a substitute for data minimization.

## Never commit by default

- .env files
- access tokens
- API keys
- OAuth refresh tokens
- auth.json or equivalent credential stores
- private keys/certificates
- passport/ID scans
- bank statements
- payroll records
- ELSTER/tax records
- highly sensitive signed employment/severance documents
- raw CRM exports containing personal data

## Prefer local or controlled document storage

Large Office files, PDFs, personal records, render folders and archives should stay outside normal Git history unless there is a documented reason to version them.

## AI / Agent Rule

Hosted agents cannot assume access to the local AMAVIO source of truth. If current business, financial, legal or personal facts are not present in the repository, they must request local verification rather than invent or infer them.
