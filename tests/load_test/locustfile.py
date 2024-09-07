import json
import time

from locust import HttpUser, between, events, task


class MyUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def chat_completion(self):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer sk-ZoHqrLIs2-5PzJrqBaviAA",
            # Include any additional headers you may need for authentication, etc.
        }

        # Customize the payload with "model" and "messages" keys
        payload = {
            "model": "gemini-flash",
            "messages": [
                {"role": "system", "content": "You are a chat bot."},
                {"role": "user", "content": "Hello, how are you?"},
            ],
            # Add more data as necessary
        }

        # Make a POST request to the "chat/completions" endpoint
        response = self.client.post("chat/completions", json=payload, headers=headers)

        # Print or log the response if needed
