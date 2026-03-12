"""Scraper para pesquisas do instituto Genial/Quaest."""

from app.models.poll import Institute, Poll
from app.services.scrapers.base_scraper import BaseScraper


class QuaestScraper(BaseScraper):
    """Coleta pesquisas eleitorais da Genial/Quaest.

    Fonte: https://quaest.com.br
    """

    institute = Institute.QUAEST

    async def fetch_latest(self) -> list[Poll]:
        """Busca as pesquisas mais recentes da Quaest."""
        polls: list[Poll] = []
        self.log_fetch(len(polls))
        return polls

    async def fetch_by_id(self, poll_id: str) -> Poll | None:
        """Busca uma pesquisa específica da Quaest."""
        return None
