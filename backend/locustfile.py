from locust import HttpUser, task, between

class ChatUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def send_message(self):
        self.client.post("/chat", json={
            "message": "what are the exam dates",
            "language": "English",
            "sessionId": "test-session"
        })