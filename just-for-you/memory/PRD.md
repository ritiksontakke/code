# Just For You

## Original problem statement
Build a cute romantic black-themed apology website for a girlfriend, with an animated teddy holding its ears and saying “I’m Sorry”, Roman Marathi response choices, a custom message, email notification to ritiksontakke1008@gmail.com, responsive mobile/desktop behavior, and a polished deployable experience.

## Architecture decisions
- React frontend with Framer Motion and Lenis for motion and smooth scrolling.
- FastAPI backend with a server-side response endpoint and managed transactional email integration.
- No user authentication required; recipient is fixed server-side to prevent open relay behavior.
- Custom SVG heart favicon and inline CSS email template.

## Implemented
- Award-style dark romantic landing page with kinetic typography, marquee, teddy animation, hearts, parallax tilt, responsive layout, and mobile-safe form.
- Roman Marathi dropdown, optional message input, validation, friendly submit error, and success screen.
- `/api/responses` endpoint with HTML email template and safety checks.
- Brand title, favicon, metadata, and `Just For You` visual identity.

## Prioritized backlog
- P0: Make `EMERGENT_EMAIL_KEY` available to the backend-managed email integration, then verify delivery and success screen.
- P1: Add a private response history view for the owner.
- P2: Add an optional ambient sound toggle and a shareable “one more chance” card.