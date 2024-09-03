# Variables
IMAGE_NAME := easyllmops-ui
CONTAINER_NAME := easyllmops-ui-container
PORT := 3000
DOCKER_FILE := Dockerfile

# PHONY targets
.PHONY: build run stop clean help logs

# Default target
all: build

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) -f $(DOCKER_FILE) .

# Run the Docker container
run:
	docker run --name $(CONTAINER_NAME) -p $(PORT):$(PORT) $(IMAGE_NAME)

# Stop the Docker container
stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

# Clean up Docker resources
clean: stop
	docker rmi $(IMAGE_NAME)

# Display container logs
logs:
	docker logs $(CONTAINER_NAME)

# Display help information
help:
	@echo "Available targets:"
	@echo "  build  - Build the Docker image"
	@echo "  run    - Run the Docker container"
	@echo "  stop   - Stop and remove the running container"
	@echo "  clean  - Stop the container and remove the image"
	@echo "  logs   - Display container logs"
	@echo "  help   - Display this help message"
