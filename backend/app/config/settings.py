"""Application settings — loads JSON configs and env variables."""

import json
import os
from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings


CONFIG_DIR = Path(__file__).parent


class Settings(BaseSettings):
    """Application settings loaded from .env and JSON config files."""

    GEMINI_API_KEY: str = ""
    DATABASE_URL: str = "sqlite+aiosqlite:///./merchant_health.db"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def weights(self) -> dict[str, float]:
        with open(CONFIG_DIR / "weights.json", "r") as f:
            return json.load(f)

    @property
    def thresholds(self) -> dict:
        with open(CONFIG_DIR / "thresholds.json", "r") as f:
            return json.load(f)

    @property
    def sample_merchants(self) -> list[dict]:
        with open(CONFIG_DIR / "sample_merchants.json", "r") as f:
            return json.load(f)


@lru_cache()
def get_settings() -> Settings:
    return Settings()
