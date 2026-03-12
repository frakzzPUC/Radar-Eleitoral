"""Scraper para pesquisas do instituto Paraná Pesquisas."""

from app.models.poll import Institute, Poll
from app.services.scrapers.base_scraper import BaseScraper


class ParanaPesquisasScraper(BaseScraper):
    """Coleta pesquisas eleitorais do Paraná Pesquisas.

    Fonte: https://paranápesquisas.com.br
    """

    institute = Institute.PARANA

    async def fetch_latest(self) -> list[Poll]:
        """Busca as pesquisas mais recentes do Paraná Pesquisas."""
        polls: list[Poll] = []
        self.log_fetch(len(polls))
        return polls

    async def fetch_by_id(self, poll_id: str) -> Poll | None:
        """Busca uma pesquisa específica do Paraná Pesquisas."""
        return None
