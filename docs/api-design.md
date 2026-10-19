# QuickNotes API Design

## 1. Overview

QuickNotes is a note-taking application. Its REST API allows
authenticated users to create, retrieve, update and delete notes.

Base URL: `https://api.quicknotes.example/v1`

Authentication: Bearer token in the Authorization header.

Content type: `application/json`

## 2. Endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | /notes | List the current user's notes | 200 OK |
| GET | /notes/{id} | Retrieve one note | 200 OK |
| POST | /notes | Create a note | 201 Created |
| PATCH | /notes/{id} | Update selected note fields | 200 OK |
| DELETE | /notes/{id} | Delete a note | 204 No Content |
| GET | /tags | List the user's tags | 200 OK |
| POST | /tags | Create a tag | 201 Created |
| POST | /notes/{id}/tags | Attach a tag to a note | 201 Created |

## 3. List notes

Request:

`GET /v1/notes?limit=10&offset=0`

Example response (200 OK):

```json
{
  "data": [
    {
      "id": 101,
      "title": "Study plan",
      "body": "Practise JavaScript daily.",
      "created_at": "2026-10-19T10:00:00Z",
      "updated_at": "2026-10-19T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1
  }
}
