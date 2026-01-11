### Build the entire backend

```sh
cd backend
# Build the services and start in detached mode
docker compose up -d -build
```

```sh
# Stop the services and delete volumes
docker compose down --volumes --remove-orphan
```

### Build only the API service

```sh
cd backend
docker build -t motochatz-be .
docker run motochatz-be
```
