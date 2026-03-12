"""Modelos de domínio para pesquisas eleitorais."""

from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum


class Institute(str, Enum):
    """Institutos de pesquisa suportados."""

    DATAFOLHA = "datafolha"
    QUAEST = "quaest"
    PARANA = "parana"
    ATLAS = "atlas"
    IBOPE = "ibope"


class ElectionType(str, Enum):
    """Tipos de eleição monitorados."""

    PRESIDENTIAL = "presidential"
    GOVERNOR = "governor"
    SENATOR = "senator"


class Trend(str, Enum):
    """Direção da tendência de um candidato."""

    UP = "up"
    DOWN = "down"
    STABLE = "stable"


@dataclass
class CandidateResult:
    """Resultado de um candidato em uma pesquisa."""

    candidate_id: str
    candidate_name: str
    party: str
    voting_intention: float
    valid_votes: float
    spontaneous: float | None = None
    rejection: float | None = None


@dataclass
class Poll:
    """Representa uma pesquisa eleitoral completa."""

    id: str
    institute: Institute
    published_at: date
    fieldwork_start: date
    fieldwork_end: date
    sample_size: int
    margin_of_error: float
    confidence_level: float
    election_type: ElectionType
    results: list[CandidateResult]
    source_url: str
    state: str | None = None


@dataclass
class AggregateResult:
    """Resultado agregado de múltiplas pesquisas para um candidato."""

    candidate_id: str
    weighted_average: float
    confidence_interval: tuple[float, float]
    polls_included: int
    last_updated: datetime
    trend: Trend
    trend_value: float
    candidate_name: str = ""
    party: str = ""


@dataclass
class Candidate:
    """Dados de um candidato."""

    id: str
    name: str
    party: str
    photo_url: str = ""
    state: str | None = None
    history: list[CandidateResult] = field(default_factory=list)
