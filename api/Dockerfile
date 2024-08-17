FROM python:3.11.0-slim

# Define and create virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV

# Activate virtual environment and set it in the PATH
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy only requirements and create empty src folder
COPY pyproject.toml poetry.lock ./
RUN mkdir -p src

# Update and install dependencies in one RUN command to reduce layers
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y poppler-utils make && \
    pip3 install --no-cache-dir --upgrade pip poetry

RUN poetry install --only main && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the project files
COPY . .

# Set PYTHONPATH to include src folder
ENV PYTHONPATH="/app/src"

# Metadata
LABEL maintainer="bmd1905"

# Expose port FastAPI will run on
EXPOSE 8000

# Run the application
CMD ["make", "start-standalone-server"]
