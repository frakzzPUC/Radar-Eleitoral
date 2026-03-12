"""Scraper para pesquisas do instituto AtlasIntel."""

from app.models.poll import Institute, Poll
from app.services.scrapers.base_scraper import BaseScraper


class AtlasIntelScraper(BaseScraper):
    """Coleta pesquisas eleitorais do AtlasIntel.

    Fonte: https://atlasintel.com.br
    """

    institute = Institute.ATLAS

    async def fetch_latest(self) -> list[Poll]:
        """Busca as pesquisas mais recentes do AtlasIntel."""
        polls: list[Poll] = []
        self.log_fetch(len(polls))
        return polls

    async def fetch_by_id(self, poll_id: str) -> Poll | None:
        """Busca uma pesquisa específica do AtlasIntel."""
        return None
