"""Classe base abstrata para scrapers de institutos de pesquisa."""

from abc import ABC, abstractmethod

from app.core.logger import logger
from app.models.poll import Institute, Poll


class BaseScraper(ABC):
    """Interface base para scrapers de pesquisas eleitorais.

    Cada instituto de pesquisa deve implementar esta interface
    para padronizar a coleta de dados.
    """

    institute: Institute

    @abstractmethod
    async def fetch_latest(self) -> list[Poll]:
        """Busca as pesquisas mais recentes do instituto.

        Returns:
            Lista de pesquisas coletadas.
        """

    @abstractmethod
    async def fetch_by_id(self, poll_id: str) -> Poll | None:
        """Busca uma pesquisa específica pelo ID.

        Parameters:
            poll_id: Identificador único da pesquisa.

        Returns:
            Pesquisa encontrada ou None.
        """

    def log_fetch(self, count: int) -> None:
        """Registra no log a quantidade de pesquisas coletadas."""
        logger.info(
            "Scraper %s coletou %d pesquisa(s)", self.institute.value, count
        )
