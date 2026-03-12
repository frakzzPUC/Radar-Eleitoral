"""Módulo de segurança: CORS, rate limiting e headers."""

from collections import defaultdict
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

_rate_limit_store: dict[str, list[datetime]] = defaultdict(list)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware de rate limiting por IP."""

    async def dispatch(self, request: Request, call_next: Any) -> Response:
        """Verifica o rate limit antes de processar a requisição."""
        client_ip = request.client.host if request.client else "unknown"
        now = datetime.now(tz=timezone.utc)
        window_start = now.timestamp() - 60

        _rate_limit_store[client_ip] = [
            ts
            for ts in _rate_limit_store[client_ip]
            if ts.timestamp() > window_start
        ]

        if len(_rate_limit_store[client_ip]) >= settings.rate_limit_per_minute:
            return Response(
                content='{"detail":"Rate limit excedido. Tente novamente em 1 minuto."}',
                status_code=429,
                media_type="application/json",
            )

        _rate_limit_store[client_ip].append(now)
        response: Response = await call_next(request)
        return response


def configure_cors(app: FastAPI) -> None:
    """Configura o middleware de CORS com origens explícitas."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adiciona headers de segurança em todas as respostas."""

    async def dispatch(self, request: Request, call_next: Any) -> Response:
        """Injeta headers de segurança na resposta."""
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response
