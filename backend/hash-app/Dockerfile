# backend/Dockerfile
# ---- Build stage ----
FROM golang:1.24.2-alpine AS builder
WORKDIR /app

# кешируем go.mod и go.sum
COPY go.mod go.sum ./
RUN go mod download

# копируем всё и собираем
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -o server cmd/main.go

# ---- Final stage ----
FROM alpine:latest
RUN apk add --no-cache ca-certificates

WORKDIR /root/
# копируем бинарь
COPY --from=builder /app/server .

# порт вашего приложения
EXPOSE 7777

ENTRYPOINT ["./server"]