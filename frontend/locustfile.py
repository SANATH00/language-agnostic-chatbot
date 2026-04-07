from locust import HttpUser, task, between

class ChatUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def send_message(self):
        self.client.post("/api/chat", json={
            "message": "what are the exam dates",
            "language": "English"
        })
        @router.post("/chat")
def chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    # current_user: str = Depends(verify_token)  # temporarily disabled for testing
):
    # comment this out too since current_user is disabled
    # db_user = db.query(models.User).filter(models.User.email == current_user).first()