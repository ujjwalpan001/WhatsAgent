import os
from pydantic_settings import BaseSettings
from pydantic import model_validator
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB
    mongo_uri: str
    mongo_db_name: str = "whatsapp_agent"

    # Meta WhatsApp
    meta_phone_number_id: str
    meta_access_token: str
    meta_verify_token: str
    meta_app_secret: str = ""   # optional — if set, validates X-Hub-Signature-256

    # LLM
    groq_api_key: str                          # PRIMARY — required
    groq_model: str = "llama-3.3-70b-versatile"
    gemini_api_key: str = ""                   # OPTIONAL — for vision / multimodal
    gemini_model: str = "gemini-2.0-flash"

    # App
    app_base_url: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # silently discard unknown env vars (e.g. legacy ADMIN_PASSWORD)

    @model_validator(mode="after")
    def _resolve_public_base_url(self):
        """
        Uploaded files (GridFS) and seeded media build absolute URLs from app_base_url —
        WhatsApp must be able to fetch them publicly. If APP_BASE_URL wasn't set (still the
        localhost default), auto-detect the platform's public domain so uploads aren't
        saved with dead localhost links.
        """
        if "localhost" in self.app_base_url or "127.0.0.1" in self.app_base_url:
            domain = (
                os.getenv("RAILWAY_PUBLIC_DOMAIN")
                or os.getenv("RAILWAY_STATIC_URL")
                or os.getenv("RENDER_EXTERNAL_URL")
            )
            if domain:
                domain = domain.replace("https://", "").replace("http://", "").rstrip("/")
                self.app_base_url = f"https://{domain}"
        return self


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
