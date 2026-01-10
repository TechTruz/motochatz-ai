# API Contract

Version: 0.0.1 (Prototype)

## REST Endpoints

| Method | URL                             | Description                                        | Authentication | Authorization  | Link |
| ------ | ------------------------------- | -------------------------------------------------- | -------------- | -------------- | ---- |
| POST   | /api/upload/signed-url          | Get pre-signed url for uploading file              | True           | Admin          |      |
| POST   | /api/upload/complete            | Send confirmation after completing the file upload | True           | Admin          |      |
| GET    | /api/manuals                    | Get all manuals data                               | True           | Admin, Chatbot |      |
| GET    | /api/manuals/:manualId          | Get a manual data                                  | True           | Admin, Chatbot |      |
| GET    | /api/repair-shops               | Get all repair shops data                          | True           | Admin          |      |
| GET    | /api/repair-shops/:repairShopId | Get a repair shop data                             | True           | Admin          |      |
| POST   | /api/auth/register              | Create a new admin account and new repair shop     | True           | Admin          |      |
| POST   | /api/auth/login                 | Login                                              | True           | Admin          |      |
| GET    | /api/chats                      | Get all chats data                                 | True           | Admin, Chatbot |      |
| GET    | /api/chats/:chatId              | Get a chat data                                    | True           | Admin, Chatbot |      |

## Websocket Channels

| Channel   | Operation | Events      | Description                                             | Authentication | Authorization  | Link |
| --------- | --------- | ----------- | ------------------------------------------------------- | -------------- | -------------- | ---- |
| /ws/chats | publish   | sendMessage | Client sends a new message to the chat room             | True           | Admin, Chatbot |      |
| /ws/chats | subscribe | newMessage  | Client receives a new message broadcast from the server | True           | Admin, Chatbot |      |
