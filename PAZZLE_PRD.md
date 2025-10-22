# Product Requirements Document (PRD): PAZZLE

## 1. Overview

PAZZLE is a platform that connects employers with workers through a
structured, data-driven system. Employers can search, review, and manage
worker profiles with detailed background information. Workers have
comprehensive profiles with personal details, experience, language
abilities, and references.

## 2. Goals

-   Enable employers to discover and hire suitable workers quickly.
-   Maintain a reliable database of verified worker profiles.
-   Allow employers to sign up and manage hiring operations.
-   Provide a backend data feed for worker information updates.

## 3. Key Features

### For Employers

-   Employer signup and authentication.
-   Dashboard to view, filter, and manage worker profiles.
-   Worker search and filtering (by language, experience, etc.).
-   Employer access to saved or shortlisted candidates.

### For Workers

-   Worker profile with:
    -   Picture and personal information.
    -   Work experience and references.
    -   Language abilities with proficiency levels.
    -   Availability and contact details.

### For Admin / Backend

-   Data feed backend to import/update worker information.
-   Admin dashboard to manage data consistency, access, and
    verification.
-   Audit and timestamp tracking for every worker entry.

## 4. Data Model (Simplified)

### Workers

  Field         Type                       Description
  ------------- -------------------------- -----------------------------------
  id            UUID                       Unique worker ID
  name          Text                       Full name
  picture_url   Text                       Profile photo URL
  experience    Text                       Work history
  languages     JSON / Related Table       List of languages and proficiency
  references    Text                       References and notes
  created_at    Timestamp with time zone   Creation timestamp

### Employers

  Field           Type                       Description
  --------------- -------------------------- -------------------------
  id              UUID                       Unique employer ID
  company_name    Text                       Employer's company name
  email           Text                       Employer login
  password_hash   Text                       Secure password
  created_at      Timestamp with time zone   Creation timestamp

### Worker Languages

  Field         Type                       Description
  ------------- -------------------------- ---------------------
  id            UUID                       Unique ID
  worker_id     UUID                       Reference to worker
  language      Text                       Language name
  proficiency   Text                       Skill level
  created_at    Timestamp with time zone   Timestamp

## 5. User Flows

### Employer Signup

1.  Employer signs up with company name, email, and password.
2.  Verification email sent.
3.  Employer logs in and accesses dashboard.

### Worker Data Feed

1.  Worker data imported via backend or admin panel.
2.  System validates and timestamps new entries.
3.  Employers can view or search in frontend dashboard.

## 6. Future Enhancements

-   Worker onboarding portal for self-registration.
-   Advanced analytics for employer hiring patterns.
-   Integration with third-party HR and payroll systems.
