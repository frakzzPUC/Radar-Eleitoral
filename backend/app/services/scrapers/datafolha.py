"""Scraper para pesquisas do instituto Datafolha."""

from app.models.poll import Institute, Poll
from app.services.scrapers.base_scraper import BaseScraper


class DatafolhaScraper(BaseScraper):
    """Coleta pesquisas eleitorais do Datafolha.

    Fonte: https://datafolha.folha.uol.com.br
    """

    institute = Institute.DATAFOLHA

    async def fetch_latest(self) -> list[Poll]:
        """Busca as pesquisas mais recentes do Datafolha."""
        # TODO: Implementar scraping real com httpx + BeautifulSoup
        polls: list[Poll] = []
        self.log_fetch(len(polls))
        return polls

    async def fetch_by_id(self, poll_id: str) -> Poll | None:
        """Busca uma pesquisa específica do Datafolha."""
        # TODO: Implementar busca por ID
        return None
