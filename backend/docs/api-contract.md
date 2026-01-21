# API Contract

Version: 0.0.1 (Prototype)

## Endpoints

| Method | URL                         | Description                               | Authentication | Authorization | Link                                |
| ------ | --------------------------- | ----------------------------------------- | -------------- | ------------- | ----------------------------------- |
| POST   | /api/auth/register          | Create a new admin account and new garage | False          | Any           | [Link](#post-apiauthregister)       |
| POST   | /api/auth/login             | Login                                     | True           | Admin         | [Link](#post-apiauthlogin)          |
| POST   | /api/auth/refresh           | Get a new access token with refresh token | True           | Admin         | [Link](#post-apiauthrefresh)        |
| DELETE | /api/auth/token             | Revoke refresh token and access token     | True           | Admin         | [Link](#delete-apiauthtoken)        |
| GET    | /api/documents/signed-url   | Get a signed url to upload a document     | True           | Admin         | [Link](#get-apidocumentssigned-url) |
| GET    | /api/documents              | Get all documents                         | True           | Admin         | [Link](#get-apidocuments)           |
| GET    | /api/stream/ingest          | Ingest a document (SSE)                   | True           | Admin         | [Link](#get-apistreamingest)        |
| GET    | /api/chats                  | Get all chat session history              | True           | Admin         | [Link](#get-apichats)               |
| GET    | /api/chats/:chatId/messages | Get messages from specific chat session   | True           | Admin         | [Link](#get-apichatschatidmessages) |
| POST   | /api/chats                  | Create a new chat session with assistant  | True           | Admin         | [Link](#post-apichats)              |
| POST   | /api/stream/chat            | Send a message to assistant (SSE)         | True           | Admin         |                                     |

---

### POST /api/auth/register

Create a new admin account and a new garage.

#### Request

- Method: `POST`
- URL: `http://localhost:3000/api/auth/register`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "email": <string>,
        "password": <string>,
        "repeatPassword": <string>,
        "firstName": <string>,
        "lastName": <string> | null,
        "garageName": <string>
    }
    ```

#### Response

- Code: `201`
- Status: `Created`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": {
            "userId": <string>,
            "email": <string>,
            "firstName": <string>,
            "lastName": <string> | null,
            "garageId": <string>,
            "garageName": <string>
        }
    }
    ```

#### Example

- Request

    ```http
    POST http://localhost:3000/api/auth/register HTTP/1.1
    Content-Type: application/json
    {
        "email": "johndoe@mail.co",
        "password": "Password123!!",
        "repeatPassword": "Password123!!",
        "firstName": "John",
        "lastName": "Doe",
        "garageName": "Bengkel Supraman"
    }
    ```

- Response

    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    {
        "data": {
            "userId": "56fc40f9d735c28df206d078",
            "email": "johndoe@mail.co",
            "firstName": "John",
            "lastName": "Doe",
            "garageId": "56fc40f9d735c28df206d032",
            "garageName": "Bengkel Supraman"
        }
    }
    ```

[Back to top](#endpoints)

---

### POST /api/auth/login

Login.

#### Request

- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "email": <string>,
        "password": <string>
    }
    ```

#### Response

- Code: `201`
- Status: `Created`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": {
            "accessToken": <string>,
            "refreshToken": <string>
        }
    }
    ```

#### Example

- Request

    ```http
    POST http://localhost:3000/api/auth/login HTTP/1.1
    Content-Type: application/json
    {
        "email": "johndoe@mail.co",
        "password": "Password123!!"
    }
    ```

- Response

    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    {
        "data": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
            "refreshToken": "8ed6a001-94f5-4241-b6db-c066f321ce4b"
        }
    }
    ```

[Back to top](#endpoints)

---

### POST /api/auth/refresh

Get a new access token with refresh token.

#### Request

- Method: `POST`
- URL: `http://localhost:3000/api/auth/refresh`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "refreshToken": <string>
    }
    ```

#### Response

- Code: `201`
- Status: `Created`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": {
            "accessToken": <string>
        }
    }
    ```

#### Example

- Request

    ```http
    POST http://localhost:3000/api/auth/refresh HTTP/1.1
    Content-Type: application/json
    {
        "refreshToken": "8ed6a001-94f5-4241-b6db-c066f321ce4b"
    }
    ```

- Response

    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    {
        "data": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
        }
    }
    ```

[Back to top](#endpoints)

---

### DELETE /api/auth/token

Revoke refresh token and access token.

#### Request

- Method: `DELETE`
- URL: `http://localhost:3000/api/auth/token`
- Headers:
    - `Content-Type: application/json`
    - `Authorization: Bearer <string>`
- Body:
    ```
    {
        "refreshToken": <string>
    }
    ```

#### Response

- Code: `204`
- Status: `No Content`

#### Example

- Request

    ```http
    DELETE http://localhost:3000/api/auth/token HTTP/1.1
    Content-Type: application/json
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    {
        "refreshToken": "8ed6a001-94f5-4241-b6db-c066f321ce4b"
    }
    ```

- Response

    ```http
    HTTP/1.1 204 No Content
    ```

[Back to top](#endpoints)

---

### GET /api/documents/signed-url

Get a signed url to upload a document.

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/documents/signed-url`
- Parameters:
    - Query:
        - `fileName=<string>`
        - `fileType=<string>`
- Headers:
    - `Authorization: Bearer <string>`

#### Response

- Code: `200`
- Status: `OK`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": {
            "documentId": <string>,
            "signedUrl": <string>,
            "documentUrl": <string>
        }
    }
    ```

#### Example

- Request

    ```http
    GET http://localhost:3000/api/documents/signed-url?fileName=honda-blade-yamaha-125-r&fileType=pdf HTTP/1.1
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    ```

- Response

    ```http
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
        "data": {
            "documentId": "56fc40f9d735c28df206d029",
            "signedUrl": "https://motochatz.s3.ap-southeast-1.amazonaws.com/honda-blade-yamaha-125-r-1737033100000.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3SGQVQG7FGA6KKA6%2F20221104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221104T140227Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=b228dbec8c1008c80c162e1210e4503dceead1e4d4751b4d9787314fd6da4d55",
            "documentUrl": "https://motochatz.s3.ap-southeast-1.amazonaws.com/honda-blade-yamaha-125-r-1737033100000.pdf"
        }
    }
    ```

[Back to top](#endpoints)

---

### GET /api/documents

Get all documents.

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/documents`
- Parameters:
    - Query:
        - `garageId=<string>`
        - `limit=<number>` (optional, default to `5`)
        - `page=<number>` (optional, default to `1`)
        - `status=<string>` (optional, default to `ALL`)
            - `ALL` (default)
            - `UPLOADED`
            - `INDEXED`
        - `sort=<string>` (optional, default to `documentId`)
            - `documentId` (default)
            - `-documentId`
            - `createdAt`
            - `-createdAt`
            - `updatedAt`
            - `-updatedAt`
- Headers:
    - `Authorization: Bearer <string>`

#### Response

- Code: `200`
- Status: `OK`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": [
            {
                "documentId": <string>,
                "documentUrl": <string>,
                "status": "ALL" | "UPLOADED" | "INDEXED",
                "createdAt": <date>,
                "updatedAt": <date>
            },
            ...
        ],
        "pagination": {
            "currentRecords": <number>,
            "totalRecords": <number>,
            "currentPage": <number>,
            "totalPage": <number>,
            "hasNextPage": <boolean>,
            "hasPrevPage": <boolean>
        }
    }
    ```

#### Example

- Request

    ```http
    GET http://localhost:3000/api/documents?garageId=56fc40f9d735c28df206d032 HTTP/1.1
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    ```

- Response

    ```http
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
        "data": [
            {
                "documentId": "56fc40f9d735c28df206d029",
                "documentUrl": "https://motochatz.s3.ap-southeast-1.amazonaws.com/honda-blade-yamaha-125-r-1737033100000.pdf",
                "status": "INDEXED",
                "createdAt": "2026-02-26T09:59:45.001Z",
                "updatedAt": "2026-02-26T11:01:04.123Z"
            },
            {
                "documentId": "56fc40f9d735c28df206d045",
                "documentUrl": "https://motochatz.s3.ap-southeast-1.amazonaws.com/toyota-avanza-15g-cvt-1976432816700.pdf",
                "status": "UPLOADED",
                "createdAt": "2026-01-26T09:59:45.001Z",
                "updatedAt": "2026-01-26T10:00:00.999Z"
            }
        ],
        "pagination": {
            "currentRecords": 2,
            "totalRecords": 2,
            "currentPage": 1,
            "totalPage": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
    ```

[Back to top](#endpoints)

---

### GET /api/stream/ingest

Ingest a document (SSE).

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/stream/ingest`
- Parameters:
    - Query:
        - `documentId=<string>`
- Headers:
    - `Authorization: Bearer <string>`

#### Response

- Code: `200`
- Status: `OK`
- Headers:
    - `Content-Type: text/event-stream; charset=utf-8`
    - `Cache-Control: no-cache`
    - `Connection: keep-alive`
    - `Transfer-Encoding: chunked`
    - `X-Accel-Buffering: no`
- Events:
    - `status`
        - `"id: <string>\n"`
        - `"data: { "status": <string>, "timestamp": <date> }\n\n"`
            - `status`
                - `PROCESSING`
                - `INGESTING`
                - `CHUNKING`
                - `EMBEDDING`
                - `INDEXING`
                - `INDEXED`

#### Example

- Request

    ```http
    GET http://localhost:3000/api/stream/ingest?documentId=56fc40f9d735c28df206d029 HTTP/1.1
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    ```

- Response

    ```http
    HTTP/1.1 200 OK
    Content-Type: text/event-stream; charset=utf-8
    Cache-Control: no-cache
    Connection: keep-alive
    Transfer-Encoding: chunked
    X-Accel-Buffering: no
    "event: \"status\"\nid: \"5ff6f9e2-22d0-47b3-bdff-d21ea71a3166\"\ndata: { \"status\": \"PROCESSING\", \"timestamp\": \"2026-02-01T05:00:00.000Z\" }\n\n"
    "event: \"status\"\nid: \"b94c9f13-d0d4-495d-8b83-2d39a409cf8a\"\ndata: { \"status\": \"INGESTING\", \"timestamp\": \"2026-02-01T05:00:33.132Z\" }\n\n"
    "event: \"status\"\nid: \"0cf316c9-2786-4842-b961-7a8cbddf2abb\"\ndata: { \"status\": \"CHUNKING\", \"timestamp\": \"2026-02-01T05:00:41.009Z\" }\n\n"
    "event: \"status\"\nid: \"6c4df984-31f5-42d6-b4ec-e64a41d4f09d\"\ndata: { \"status\": \"EMBEDDING\", \"timestamp\": \"2026-02-01T05:00:59.999Z\" }\n\n"
    "event: \"status\"\nid: \"20662c03-84c0-4a1d-8d15-601e3569f39c\"\ndata: { \"status\": \"INDEXING\", \"timestamp\": \"2026-02-01T05:01:14.111Z\" }\n\n"
    "event: \"status\"\nid: \"4fd9b8bd-27fc-41c2-9747-b7282e9d54e7\"\ndata: { \"status\": \"INDEXED\", \"timestamp\": \"2026-02-01T05:01:15.999Z\" }\n\n"
    ```

[Back to top](#endpoints)

---

### GET /api/chats

Get all chat session history.

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/chats`
- Parameters:
    - Query:
        - `garageId=<string>`
        - `userId=<string>` (optional, default to any user)
        - `limit=<number>` (optional, default to `5`)
        - `page=<number>` (optional, default to `1`)
        - `status=<string>` (optional, default to `ALL`)
            - `ALL` (default)
            - `ONGOING`
            - `ENDED`
        - `sort=<string>` (optional, default to `chatId`)
            - `chatId` (default)
            - `-chatId`
            - `createdAt`
            - `-createdAt`
            - `updatedAt`
            - `-updatedAt`
- Headers:
    - `Authorization: Bearer <string>`

#### Response

- Code: `200`
- Status: `OK`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": [
            {
                "chatId": <string>,
                "userId": <string>,
                "userFirstName": <string>,
                "userLastName": <string> | null,
                "status": "ALL" | "ONGOING" | "ENDED",
                "remainingQuota": <number>,
                "createdAt": <date>,
                "updatedAt": <date>
            },
            ...
        ],
        "pagination": {
            "currentRecords": <number>,
            "totalRecords": <number>,
            "currentPage": <number>,
            "totalPage": <number>,
            "hasNextPage": <boolean>,
            "hasPrevPage": <boolean>
        }
    }
    ```

#### Example

- Request

    ```http
    GET http://localhost:3000/api/chats?garageId=56fc40f9d735c28df206d032 HTTP/1.1
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    ```

- Response

    ```http
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
        "data": [
            {
                "chatId": "56fc40f9d735c28df206c674",
                "userId": "56fc40f9d735c2fda54daf6d",
                "userFirstName": "John",
                "userLastName": "Doe",
                "status": "ONGOING",
                "remainingQuota": 3,
                "createdAt": "2026-01-19T07:06:14.733Z",
                "updatedAt": "2026-01-19T07:06:36.189Z"
            },
            {
                "chatId": "e4fd657a4e544da7f54e7d57",
                "userId": "dca2345a25c4ad2cda453add",
                "userFirstName": "Jane",
                "userLastName": null,
                "status": "ENDED",
                "remainingQuota": 0,
                "createdAt": "2026-01-19T07:12:23.697Z",
                "updatedAt": "2026-01-19T07:14:39.584Z"
            }
        ],
        "pagination": {
            "currentRecords": 2,
            "totalRecords": 2,
            "currentPage": 1,
            "totalPage": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
    ```

[Back to top](#endpoints)

---

### GET /api/chats/:chatId/messages

Get messages from specific chat session.

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/chats/:chatId/messages`
- Parameters:
    - Path:
        - `chatId`: `<string>`
    - Query:
        - `limit=<number>` (optional, default to `10`)
        - `cursor=<string>` (optional, value of `messageId`)
        - `sort=<string>` (optional, default to `-createdAt`)
            - `createdAt`
            - `-createdAt` (default)
            - `updatedAt`
            - `-updatedAt`
- Headers:
    - `Authorization: Bearer <string>`

#### Response

- Code: `200`
- Status: `OK`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": [
            {
                "messageId": <string>,
                "role": "ASSISTANT" | {
                    "userId": <string>,
                    "userFirstName": <string>,
                    "userLastName": <string> | null
                },
                "message": <string>,
                "referencedDocuments": [
                    {
                        "documentId": <string>,
                        "documentUrl": <string
                    },
                    ...
                ],
                "createdAt": <date>,
                "updatedAt": <date>
            },
            ...
        ],
        "pagination": {
            "currentRecords": <number>,
            "totalRecords": <number>,
            "latestCursor": <string>,
            "oldestCursor": <string>,
            "sort": "createdAt" | "-createdAt" | "updatedAt" | "-updatedAt",
            "hasNextPage": <boolean>,
            "hasPrevPage": <boolean>
        }
    }
    ```

#### Example

- Request

    ```http
    GET http://localhost:3000/api/chats/56fc40f9d735c28df206c674/messages HTTP/1.1
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    ```

- Response

    ```http
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
        "data": [
            {
                "messageId": "6970755dad814745c68ce5b0",
                "role": {
                    "userId": "6970756ee3d1d377ce8ce5b0",
                    "userFirstName": "John",
                    "userLastName": "Doe"
                },
                "message": "Engine warning light is on. Car feels sluggish and fuel consumption is higher than usual.",
                "createdAt": "2026-01-21T06:51:46.826Z",
                "updatedAt": "2026-01-21T06:51:46.826Z"
            },
            {
                "messageId": "6970764e37d24577fe8ce5b0",
                "role": "ASSISTANT",
                "message": "Alright, let’s narrow this down step by step.\nBased on the symptoms (check engine light, low power, high fuel usage) on a Toyota Avanza 2019, the most common causes are:\n1. Faulty oxygen (O2) sensor\nThis causes incorrect air–fuel mixture readings, leading to rich fuel conditions.\n2. Dirty or failing Mass Air Flow (MAF) sensor\nA contaminated MAF can miscalculate incoming air, reducing engine efficiency.\n3. Ignition issues (spark plugs or coils)\nWeak ignition can cause incomplete combustion.",
                "referencedDocuments": [
                    {
                        "documentId": "56fc40f9d735c28df206d029",
                        "documentUrl": "https://motochatz.s3.ap-southeast-1.amazonaws.com/honda-blade-yamaha-125-r-1737033100000.pdf"
                    }
                ],
                "createdAt": "2026-01-21T06:53:00.001Z",
                "updatedAt": "2026-01-21T06:53:00.001Z"
            }
        ],
        "pagination": {
            "currentRecords": 2,
            "totalRecords": 2,
            "latestCursor": "6970764e37d24577fe8ce5b0",
            "oldestCursor": "6970755dad814745c68ce5b0",
            "sort": "-createdAt",
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
    ```

[Back to top](#endpoints)

---

### POST /api/chats

Create a new chat session with assistant.

#### Request

- Method: `POST`
- URL: `http://localhost:3000/api/chats`
- Headers:
    - `Authorization: Bearer <string>`

#### Response

- Code: `201`
- Status: `Created`
- Headers:
    - `Content-Type: application/json`
- Body:
    ```
    {
        "data": {
            "chatId": <string>
        }
    }
    ```

#### Example

- Request

    ```http
    POST http://localhost:3000/api/chats HTTP/1.1
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
    ```

- Response

    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    {
        "data": {
            "chatId": "6970f5b1e6a560b7d28ce5b0"
        }
    }
    ```

[Back to top](#endpoints)
