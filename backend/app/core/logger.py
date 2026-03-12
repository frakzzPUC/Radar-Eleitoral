"""Módulo de logging estruturado do Radar Eleitoral 2026."""

import logging
import sys

from app.core.config import settings


def setup_logger(name: str = "radar_eleitoral") -> logging.Logger:
    """Configura e retorna um logger estruturado.

    Parameters:
        name: Nome do logger.

    Returns:
        Logger configurado com handler para stdout.
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.log_level.upper(), logging.INFO))

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


logger = setup_logger()
