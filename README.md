# QuickNotes — API Client and System Design

QuickNotes is a browser-based note client and system-design exercise covering HTTP APIs, relational data modelling and scalable architecture.

## Features
- Load notes using GET.
- Create notes using POST.
- Delete notes using DELETE.
- Display loading, success and error states.
- Validate required titles up to 100 characters.
- Insert user-provided content with textContent.

## Run locally
Open index.html in a browser with an internet connection. Alternatively, serve the directory using a local static development server.

The client uses JSONPlaceholder:
https://jsonplaceholder.typicode.com/posts

JSONPlaceholder simulates POST and DELETE operations; changes are not permanently persisted. The production API in the design documents is a proposal, not a deployed backend.

## Design documents
- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## What I learned
1. How HTTP methods, status codes and API contracts work.
2. How asynchronous requests and errors are handled.
3. How primary keys, foreign keys and junction tables model data.
4. How caching, replicas, queues and multiple app servers support scaling.
5. Why syntax checks and meaningful Git commits matter.

## Current limitations
This educational project does not implement production authentication, a database backend or persistent note storage.
