# QuickNotes Data Model

## Tables and relationships

- users: one user can own many notes and tags.
- notes: each note belongs to one user.
- tags: each tag belongs to one user.
- note_tags: junction table supporting many-to-many relationships between notes and tags.

## SQL schema

    CREATE TABLE users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE notes (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE tags (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(50) NOT NULL,
      UNIQUE (user_id, name)
    );

    CREATE TABLE note_tags (
      note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
      tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (note_id, tag_id)
    );

    CREATE INDEX idx_notes_user_created ON notes(user_id, created_at DESC);
    CREATE INDEX idx_note_tags_tag ON note_tags(tag_id);

## Example queries

### 1. List a user's notes

    SELECT id, title, body, created_at
    FROM notes
    WHERE user_id = 1
    ORDER BY created_at DESC
    LIMIT 20;

### 2. List notes and their tags (JOIN)

    SELECT n.title, t.name AS tag
    FROM notes n
    JOIN note_tags nt ON n.id = nt.note_id
    JOIN tags t ON t.id = nt.tag_id
    WHERE n.user_id = 1;

### 3. Count notes per user

    SELECT u.email, COUNT(n.id) AS note_count
    FROM users u
    LEFT JOIN notes n ON n.user_id = u.id
    GROUP BY u.id, u.email;

## Index rationale

The index on (user_id, created_at DESC) speeds up retrieval of a user's newest notes. The tag index helps find notes associated with a tag.

## SQL versus NoSQL

PostgreSQL is a strong default because notes have clear ownership, tags create relationships, and foreign keys and transactions help preserve consistency. A document database may suit flexible data structures, but adds complexity without a demonstrated need.
