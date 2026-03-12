"""Ponto de entrada da aplicação FastAPI — Radar Eleitoral 2026."""

from fastapi import FastAPI

from app.core.config import settings
from app.core.logger import logger
from app.core.security import (
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
    configure_cors,
)
from app.routers import aggregate, candidates, polls

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    openapi_url=f"{settings.api_prefix}/openapi.json",
)

configure_cors(app)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)

app.include_router(polls.router, prefix=settings.api_prefix)
app.include_router(candidates.router, prefix=settings.api_prefix)
app.include_router(aggregate.router, prefix=settings.api_prefix)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Endpoint de health check."""
    return {"status": "ok", "app": settings.app_name}


logger.info("Radar Eleitoral 2026 inicializado")
