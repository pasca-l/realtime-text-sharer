FROM --platform=linux/amd64 golang:1.23-bookworm

WORKDIR /home/local/

RUN apt-get update && apt-get upgrade -y

COPY */go.mod */go.sum ./
