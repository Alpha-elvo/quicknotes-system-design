# QuickNotes System Architecture

## Functional requirements
- Create, list, view, update and delete notes.
- Organize notes using tags.
- Restrict each user's notes to authorized access.

## Non-functional requirements
- Secure authentication and authorization.
- Low latency for common reads.
- High availability and horizontal scalability.
- Backups, monitoring and reliable recovery.

## Estimates for 1 million registered users

Assumptions: 10% daily active users, 20 reads and 2 writes per active user daily, and average note size of 1 KB.

- Reads: 2 million/day, about 23 requests/second on average.
- Writes: 200,000/day, about 2.3 requests/second on average.
- At a 10x peak: approximately 230 reads/second and 23 writes/second.
- Annual note data: approximately 73 GB raw, excluding indexes, backups and replicas. Allow roughly 150–220 GB/year with overhead, then measure actual usage.

These are planning estimates, not production measurements.

## Architecture diagram

    Clients (web/mobile)
            |
           DNS
            |
           CDN
            |
      Load Balancer
        /       \
    App Server 1  App Server 2
        \          /
           Cache
             |
       Primary Database
             |
         Read Replica

    App Server --> Message Queue --> Background Worker

## Components
- DNS resolves the service domain.
- CDN serves cached static assets close to users.
- Load balancer distributes traffic across healthy app servers.
- Two app servers provide horizontal capacity and reduce dependence on one server.
- Cache reduces repeated database reads but needs expiration and invalidation.
- Primary database handles writes and transactions.
- Read replica can serve suitable reads but may lag behind the primary.
- Message queue buffers asynchronous work.
- Background worker processes queued jobs independently.

## GET /notes flow
1. Client sends an authenticated GET request.
2. DNS resolves the service; CDN serves eligible static assets.
3. Load balancer selects a healthy application server.
4. Server validates authentication and authorization.
5. Server checks cache and queries the database or replica when needed.
6. Server returns paginated JSON.

## POST /notes flow
1. Client sends an authenticated POST request with JSON.
2. Load balancer routes the request to a healthy app server.
3. Server validates the token, title and request body.
4. Server verifies ownership and inserts the note in a database transaction.
5. Server invalidates relevant cache entries and may enqueue background work.
6. Server returns 201 Created with the new note.

## Trade-offs and reliability
- Cache versus consistency: cache improves speed but can return stale data. Use expiry and invalidation after writes.
- Replicas versus freshness: replicas improve read capacity but can lag. Use the primary for read-after-write operations when necessary.
- Multiple app servers reduce single-server failure risk; use health checks and deploy across failure domains when possible.
- Database replication improves recovery options but is not a substitute for backups. Test restoration and document failover procedures.
- Queues support asynchronous processing, but workers need retries, idempotency and dead-letter handling.
- The primary database remains a possible single point of failure unless automated failover is configured.
