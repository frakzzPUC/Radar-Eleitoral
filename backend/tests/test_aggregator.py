"""Testes unitários para o serviço de agregação."""

from datetime import date, datetime, timezone

import pytest

from app.models.poll import (
    AggregateResult,
    CandidateResult,
    ElectionType,
    Institute,
    Poll,
    Trend,
)
from app.services.aggregator import (
    aggregate_all_candidates,
    calculate_weighted_average,
    group_polls_by_candidate,
)


def _make_poll(
    poll_id: str,
    published_at: date,
    sample_size: int,
    results: list[CandidateResult],
) -> Poll:
    """Helper para criar pesquisas de teste."""
    return Poll(
        id=poll_id,
        institute=Institute.DATAFOLHA,
        published_at=published_at,
        fieldwork_start=published_at,
        fieldwork_end=published_at,
        sample_size=sample_size,
        margin_of_error=2.0,
        confidence_level=95.0,
        election_type=ElectionType.PRESIDENTIAL,
        results=results,
        source_url="https://example.com",
    )


class TestCalculateWeightedAverage:
    """Testes para calculate_weighted_average."""

    def test_retorna_none_sem_dados(self) -> None:
        """Deve retornar None quando não há dados do candidato."""
        result = calculate_weighted_average([], "inexistente")
        assert result is None

    def test_calcula_com_uma_pesquisa(self) -> None:
        """Deve calcular corretamente com uma única pesquisa."""
        polls = [
            _make_poll(
                "p1",
                date.today(),
                2000,
                [CandidateResult("cand1", "Candidato 1", "PT", 30.0, 35.0)],
            )
        ]
        result = calculate_weighted_average(polls, "cand1")
        assert result is not None
        assert result.candidate_id == "cand1"
        assert result.weighted_average == 30.0
        assert result.polls_included == 1

    def test_calcula_com_multiplas_pesquisas(self) -> None:
        """Deve ponderar corretamente pesquisas com tamanhos diferentes."""
        polls = [
            _make_poll(
                "p1",
                date.today(),
                4000,
                [CandidateResult("cand1", "Candidato 1", "PT", 30.0, 35.0)],
            ),
            _make_poll(
                "p2",
                date.today(),
                1000,
                [CandidateResult("cand1", "Candidato 1", "PT", 20.0, 25.0)],
            ),
        ]
        result = calculate_weighted_average(polls, "cand1")
        assert result is not None
        # Pesquisa com amostra maior deve ter mais influência
        assert result.weighted_average > 25.0
        assert result.polls_included == 2

    def test_ignora_candidato_ausente(self) -> None:
        """Deve retornar None quando candidato não está nas pesquisas."""
        polls = [
            _make_poll(
                "p1",
                date.today(),
                2000,
                [CandidateResult("cand1", "Candidato 1", "PT", 30.0, 35.0)],
            )
        ]
        result = calculate_weighted_average(polls, "cand_inexistente")
        assert result is None

    def test_intervalo_confianca_valido(self) -> None:
        """O intervalo de confiança deve estar entre 0 e 100."""
        polls = [
            _make_poll(
                "p1",
                date.today(),
                2000,
                [CandidateResult("cand1", "Candidato 1", "PT", 50.0, 55.0)],
            )
        ]
        result = calculate_weighted_average(polls, "cand1")
        assert result is not None
        lower, upper = result.confidence_interval
        assert 0 <= lower <= upper <= 100


class TestAggregateAllCandidates:
    """Testes para aggregate_all_candidates."""

    def test_retorna_vazio_sem_pesquisas(self) -> None:
        """Deve retornar lista vazia sem pesquisas."""
        result = aggregate_all_candidates([])
        assert result == []

    def test_ordena_por_media_desc(self) -> None:
        """Deve ordenar resultados por média ponderada decrescente."""
        polls = [
            _make_poll(
                "p1",
                date.today(),
                2000,
                [
                    CandidateResult("cand1", "Candidato 1", "PT", 30.0, 35.0),
                    CandidateResult("cand2", "Candidato 2", "PL", 20.0, 25.0),
                    CandidateResult("cand3", "Candidato 3", "MDB", 10.0, 12.0),
                ],
            )
        ]
        results = aggregate_all_candidates(polls)
        assert len(results) == 3
        assert results[0].candidate_id == "cand1"
        assert results[1].candidate_id == "cand2"
        assert results[2].candidate_id == "cand3"


class TestGroupPollsByCandidate:
    """Testes para group_polls_by_candidate."""

    def test_agrupa_corretamente(self) -> None:
        """Deve agrupar pontos de dados por candidato."""
        d1 = date(2026, 1, 1)
        d2 = date(2026, 2, 1)
        polls = [
            _make_poll(
                "p1",
                d1,
                2000,
                [CandidateResult("cand1", "C1", "PT", 30.0, 35.0)],
            ),
            _make_poll(
                "p2",
                d2,
                2000,
                [CandidateResult("cand1", "C1", "PT", 32.0, 37.0)],
            ),
        ]
        groups = group_polls_by_candidate(polls)
        assert "cand1" in groups
        assert len(groups["cand1"]) == 2
        # Deve estar ordenado por data
        assert groups["cand1"][0][0] == d1
        assert groups["cand1"][1][0] == d2
