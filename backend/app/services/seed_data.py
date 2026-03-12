"""Dados de demonstração para o Radar Eleitoral 2026.

Seed data para desenvolvimento. Será substituído por
dados reais dos scrapers em produção.
"""

from datetime import date

from app.models.poll import (
    Candidate,
    CandidateResult,
    ElectionType,
    Institute,
    Poll,
)

CANDIDATES: list[Candidate] = [
    Candidate(id="lula", name="Lula", party="PT"),
    Candidate(id="flavio", name="Flávio Bolsonaro", party="PL"),
    Candidate(id="zema", name="Romeu Zema", party="NOVO"),
    Candidate(id="caiado", name="Ronaldo Caiado", party="União Brasil"),
    Candidate(id="ratinho", name="Ratinho Júnior", party="PSD"),
    Candidate(id="michelle", name="Michelle Bolsonaro", party="PL"),
]

SEED_POLLS: list[Poll] = [
    Poll(
        id="df-2026-001",
        institute=Institute.DATAFOLHA,
        published_at=date(2026, 2, 15),
        fieldwork_start=date(2026, 2, 10),
        fieldwork_end=date(2026, 2, 13),
        sample_size=2048,
        margin_of_error=2.0,
        confidence_level=95.0,
        election_type=ElectionType.PRESIDENTIAL,
        source_url="https://datafolha.folha.uol.com.br/eleicoes/2026/pesquisa-001",
        results=[
            CandidateResult("lula", "Lula", "PT", 28.5, 33.2, 18.0, 38.0),
            CandidateResult("flavio", "Flávio Bolsonaro", "PL", 18.0, 21.0, 10.0, 35.0),
            CandidateResult("zema", "Romeu Zema", "NOVO", 12.0, 14.0, 6.0, 15.0),
            CandidateResult("caiado", "Ronaldo Caiado", "União Brasil", 10.5, 12.2, 5.0, 12.0),
            CandidateResult("ratinho", "Ratinho Júnior", "PSD", 8.0, 9.3, 4.0, 10.0),
            CandidateResult("michelle", "Michelle Bolsonaro", "PL", 7.5, 8.7, 4.0, 32.0),
        ],
    ),
    Poll(
        id="qa-2026-001",
        institute=Institute.QUAEST,
        published_at=date(2026, 2, 20),
        fieldwork_start=date(2026, 2, 16),
        fieldwork_end=date(2026, 2, 18),
        sample_size=2000,
        margin_of_error=2.2,
        confidence_level=95.0,
        election_type=ElectionType.PRESIDENTIAL,
        source_url="https://quaest.com.br/pesquisas/2026/001",
        results=[
            CandidateResult("lula", "Lula", "PT", 30.0, 34.5, 20.0, 36.0),
            CandidateResult("flavio", "Flávio Bolsonaro", "PL", 17.0, 19.5, 9.0, 36.0),
            CandidateResult("zema", "Romeu Zema", "NOVO", 13.5, 15.5, 7.0, 14.0),
            CandidateResult("caiado", "Ronaldo Caiado", "União Brasil", 11.0, 12.6, 6.0, 11.0),
            CandidateResult("ratinho", "Ratinho Júnior", "PSD", 7.5, 8.6, 3.5, 11.0),
            CandidateResult("michelle", "Michelle Bolsonaro", "PL", 8.0, 9.2, 5.0, 30.0),
        ],
    ),
    Poll(
        id="at-2026-001",
        institute=Institute.ATLAS,
        published_at=date(2026, 2, 25),
        fieldwork_start=date(2026, 2, 20),
        fieldwork_end=date(2026, 2, 23),
        sample_size=4500,
        margin_of_error=1.5,
        confidence_level=95.0,
        election_type=ElectionType.PRESIDENTIAL,
        source_url="https://atlasintel.com.br/pesquisas/2026-001",
        results=[
            CandidateResult("lula", "Lula", "PT", 29.0, 33.8, 19.0, 37.0),
            CandidateResult("flavio", "Flávio Bolsonaro", "PL", 19.5, 22.7, 11.0, 34.0),
            CandidateResult("zema", "Romeu Zema", "NOVO", 14.0, 16.3, 8.0, 13.0),
            CandidateResult("caiado", "Ronaldo Caiado", "União Brasil", 9.5, 11.1, 5.0, 13.0),
            CandidateResult("ratinho", "Ratinho Júnior", "PSD", 8.5, 9.9, 4.5, 9.0),
            CandidateResult("michelle", "Michelle Bolsonaro", "PL", 6.5, 7.6, 3.0, 33.0),
        ],
    ),
    Poll(
        id="pr-2026-001",
        institute=Institute.PARANA,
        published_at=date(2026, 3, 1),
        fieldwork_start=date(2026, 2, 25),
        fieldwork_end=date(2026, 2, 28),
        sample_size=2020,
        margin_of_error=2.2,
        confidence_level=95.0,
        election_type=ElectionType.PRESIDENTIAL,
        source_url="https://paranápesquisas.com.br/pesquisas/2026-001",
        results=[
            CandidateResult("lula", "Lula", "PT", 27.0, 32.0, 17.0, 40.0),
            CandidateResult("flavio", "Flávio Bolsonaro", "PL", 20.0, 23.7, 12.0, 33.0),
            CandidateResult("zema", "Romeu Zema", "NOVO", 11.5, 13.6, 6.0, 16.0),
            CandidateResult("caiado", "Ronaldo Caiado", "União Brasil", 10.0, 11.9, 5.5, 12.0),
            CandidateResult("ratinho", "Ratinho Júnior", "PSD", 9.0, 10.7, 5.0, 8.0),
            CandidateResult("michelle", "Michelle Bolsonaro", "PL", 7.0, 8.3, 3.5, 31.0),
        ],
    ),
    Poll(
        id="ib-2026-001",
        institute=Institute.IBOPE,
        published_at=date(2026, 3, 5),
        fieldwork_start=date(2026, 3, 1),
        fieldwork_end=date(2026, 3, 3),
        sample_size=3008,
        margin_of_error=1.8,
        confidence_level=95.0,
        election_type=ElectionType.PRESIDENTIAL,
        source_url="https://ipec.com.br/pesquisas/2026-001",
        results=[
            CandidateResult("lula", "Lula", "PT", 31.0, 35.6, 21.0, 35.0),
            CandidateResult("flavio", "Flávio Bolsonaro", "PL", 16.5, 19.0, 9.0, 37.0),
            CandidateResult("zema", "Romeu Zema", "NOVO", 14.5, 16.7, 8.0, 12.0),
            CandidateResult("caiado", "Ronaldo Caiado", "União Brasil", 11.5, 13.2, 6.0, 10.0),
            CandidateResult("ratinho", "Ratinho Júnior", "PSD", 7.0, 8.0, 3.5, 9.0),
            CandidateResult("michelle", "Michelle Bolsonaro", "PL", 6.0, 6.9, 3.0, 34.0),
        ],
    ),
]
