############################################################
# Ruff commands
############################################################

# Format code using ruff
ruff-format:
	poetry run ruff format .

# Check code using ruff for linting issues
ruff-check:
	poetry run ruff check .

# Run tests with pytest
test:
	poetry run pytest

# Run format and lint checks sequentially
lint:
	poetry run ruff format . && \
	poetry run ruff check .

# Run all checks
all:
	$(MAKE) lint
	poetry run pytest

############################################################
# Pre-commit checks
############################################################

# Run pre-commit checks
pre-commit:
	poetry run pre-commit run --all-files -v


############################################################
# Docker compose commands
############################################################

.PHONY: docker-compose-dev-up
docker-compose-dev-up:
	sudo docker compose -f docker-compose.yaml up --build

.PHONY: docker-compose-dev-down
docker-compose-dev-down:
	sudo docker compose -f docker-compose.yaml down
