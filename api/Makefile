############################################################
# Makefile for managing code formatting, linting, and testing
############################################################

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
CYAN := \033[0;36m
RESET := \033[0m

# Format code using ruff
format:
	@echo "$(CYAN)Formatting code with ruff...$(RESET)"
	@poetry run ruff format .
	@echo "$(GREEN)Code formatted successfully.$(RESET)"

# Check code using ruff for linting issues
lint-check:
	@echo "$(CYAN)Checking code for linting issues with ruff...$(RESET)"
	@poetry run ruff check .
	@echo "$(GREEN)Linting check completed.$(RESET)"

# Sort imports using isort
sort-imports:
	@echo "$(CYAN)Sorting imports with isort...$(RESET)"
	@poetry run isort .
	@echo "$(GREEN)Imports sorted successfully.$(RESET)"

# Run format, import sorting, and lint checks sequentially and fix issues
lint-fix:
	@echo "$(YELLOW)Running format, import sorting, and lint checks...$(RESET)"
	@$(MAKE) format
	@$(MAKE) sort-imports
	@$(MAKE) lint-check
	@echo "$(GREEN)All linting and formatting fixes applied successfully.$(RESET)"

# Run all checks (formatting, linting, and testing)
all:
	@echo "$(YELLOW)Running all checks...$(RESET)"
	@$(MAKE) lint-fix
	@echo "$(GREEN)All checks completed successfully.$(RESET)"


############################################################
# Pre-commit checks
############################################################

# Run tests with pytest
test:
	@echo "Running tests with pytest..."
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

.PHONY: docker-compose-mac-dev-up
docker-compose-mac-dev-up:
	sudo docker compose -f docker-compose-mac.yaml up --build

.PHONY: docker-compose-dev-down
docker-compose-dev-down:
	sudo docker compose -f docker-compose.yaml down


############################################################
# Standalone commands
############################################################
.PHONE: start-standalone-server
start-standalone-server:
	poetry run uvicorn src.main:app --host 0.0.0.0 --port 30000
