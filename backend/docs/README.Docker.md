### Build the entire backend

```sh
cd backend

# Create a new .env.docker file and assign the variables according to .env.docker.example
touch .env.docker

# To generate JWT_SECRET
openssl rand -hex 32 | sed 's/^/JWT_SECRET=/' >> .env.docker

# Build the services and start in detached mode
docker compose --env-file .env.docker up -d --build
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
