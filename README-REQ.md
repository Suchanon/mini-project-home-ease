# HomeEase — Home Service Platform

A take-home project for evaluating full-stack engineering candidates. **HomeEase** is a home services marketplace that connects customers needing household services (Plumbing, Electrical, AC Repair, etc.) with qualified Service Providers. The platform is operated end-to-end through a unified Admin Panel.

---

## Overview

This project simulates a real-world service-on-demand product. You will design and implement:

- A customer-facing flow for browsing services and booking a provider.
- A backend that matches bookings to available providers and orchestrates the booking lifecycle.
- An all-in-one Admin Panel for managing services, providers, and bookings.

The goal is to evaluate your ability to design clean data models, implement a workflow with clear state transitions, structure a maintainable codebase, and ship a working dockerized application.

---

## Scope & Requirements

### 1. Service Listing & Search (Customer Side)

- Browse available service categories (e.g., Plumbing, Electrical, AC Repair, Cleaning).
- Filter and search services by keyword and/or category.
- View baseline pricing and a short description for each service.

### 2. Booking Flow

- Authenticated users can select a service and create a booking with:
  - Issue description
  - Preferred date and time
  - Service address
- Users can view their own booking history and the current status of each booking.

### 3. Service Provider Matching & Workflow

- When a booking is created, the system matches and assigns it to one or more eligible Service Providers based on category/skills and availability.
- The booking lifecycle must follow clear, well-defined state transitions:

```
Pending  →  Accepted  →  In-Progress  →  Completed
                                      ↘  Cancelled
```

- Invalid transitions (e.g., `Completed` → `Pending`) must be rejected by the API.
- Providers can accept, start, complete, or cancel an assigned booking.

### 4. Admin Panel (All-in-One Dashboard)

A single authenticated admin interface that handles the entire platform. No separate provider/customer portals are required for admin operations.

**Service & Booking Management**
- Full CRUD on service categories and baseline pricing.
- Master list of all bookings with filters (status, date range, category, provider).
- Ability to view booking detail and override its status when needed.

**Provider Management**
- Full CRUD on Service Provider profiles.
- Assign skills/categories to providers.
- Toggle provider availability (Available / Unavailable / On Leave).
- See which provider is assigned to each booking.

---