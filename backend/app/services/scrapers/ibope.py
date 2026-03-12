"""Scraper para pesquisas do instituto Ibope/Ipec."""

from app.models.poll import Institute, Poll
from app.services.scrapers.base_scraper import BaseScraper


class IbopeScraper(BaseScraper):
    """Coleta pesquisas eleitorais do Ibope/Ipec.

    Inclui dados históricos e novas pesquisas.
    """

    institute = Institute.IBOPE

    async def fetch_latest(self) -> list[Poll]:
        """Busca as pesquisas mais recentes do Ibope/Ipec."""
        polls: list[Poll] = []
        self.log_fetch(len(polls))
        return polls

    async def fetch_by_id(self, poll_id: str) -> Poll | None:
        """Busca uma pesquisa específica do Ibope/Ipec."""
        return None
