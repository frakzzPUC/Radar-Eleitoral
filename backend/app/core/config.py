"""Módulo de configuração central do Radar Eleitoral 2026."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configurações da aplicação carregadas via variáveis de ambiente."""

    app_name: str = "Radar Eleitoral 2026"
    debug: bool = False
    api_prefix: str = "/api/v1"
    allowed_origins: list[str] = ["http://localhost:5173"]
    rate_limit_per_minute: int = 60
    log_level: str = "INFO"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
