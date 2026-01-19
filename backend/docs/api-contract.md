# API Contract

Version: 0.0.1 (Prototype)

## Endpoints

| Method | URL                        | Description                               | Authentication | Authorization | Link                                |
| ------ | -------------------------- | ----------------------------------------- | -------------- | ------------- | ----------------------------------- |
| POST   | /api/auth/register         | Create a new admin account and new garage | False          | Any           | [Link](#post-apiauthregister)       |
| POST   | /api/auth/login            | Login                                     | True           | Admin         | [Link](#post-apiauthlogin)          |
| POST   | /api/auth/refresh          | Get a new access token with refresh token | True           | Admin         | [Link](#post-apiauthrefresh)        |
| GET    | /api/documents/signed-url  | Get a signed url to upload a document     | True           | Admin         | [Link](#get-apidocumentssigned-url) |
| GET    | /api/documents             | Get all documents                         | True           | Admin         |                                     |
| GET    | /api/documents/:documentId | Get a specific document by id             | True           | Admin         |                                     |
| GET    | /api/stream/ingest         | Ingest a document (SSE)                   | True           | Admin         |                                     |
| POST   | /api/chats                 | Create a new chat session with assistant  | True           | Admin         |                                     |
| POST   | /api/stream/chat           | Send a message to assistant (SSE)         | True           | Admin         |                                     |

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
        "lastName": <string> || null,
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
            "id": <string>,
            "email": <string>,
            "firstName": <string>,
            "lastName": <string> || null,
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
            "id": "56fc40f9d735c28df206d078",
            "email": "johndoe@mail.co",
            "firstName": "John",
            "lastName": "Doe",
            "garageId": "56fc40f9d735c28df206d032",
            "garageName": "Bengkel Supraman"
        }
    }
    ```

[Back to top](#endpoints)

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
