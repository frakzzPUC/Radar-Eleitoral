"""Schemas Pydantic para validação de entrada/saída da API."""

from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base com serialização camelCase para manter contrato com o frontend."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class InstituteEnum(str, Enum):
    """Institutos de pesquisa válidos."""

    DATAFOLHA = "datafolha"
    QUAEST = "quaest"
    PARANA = "parana"
    ATLAS = "atlas"
    IBOPE = "ibope"


class ElectionTypeEnum(str, Enum):
    """Tipos de eleição válidos."""

    PRESIDENTIAL = "presidential"
    GOVERNOR = "governor"
    SENATOR = "senator"


class TrendEnum(str, Enum):
    """Direções de tendência."""

    UP = "up"
    DOWN = "down"
    STABLE = "stable"


class CandidateResultSchema(CamelModel):
    """Schema para resultado de um candidato em uma pesquisa."""

    candidate_id: str = Field(..., min_length=1, max_length=100)
    candidate_name: str = Field(..., min_length=1, max_length=200)
    party: str = Field(..., min_length=1, max_length=50)
    voting_intention: float = Field(..., ge=0, le=100)
    valid_votes: float = Field(..., ge=0, le=100)
    spontaneous: float | None = Field(None, ge=0, le=100)
    rejection: float | None = Field(None, ge=0, le=100)


class PollSchema(CamelModel):
    """Schema para uma pesquisa eleitoral completa."""

    id: str = Field(..., min_length=1, max_length=100)
    institute: InstituteEnum
    published_at: date
    fieldwork_start: date
    fieldwork_end: date
    sample_size: int = Field(..., gt=0, le=1_000_000)
    margin_of_error: float = Field(..., gt=0, le=20)
    confidence_level: float = Field(..., gt=0, le=100)
    election_type: ElectionTypeEnum
    state: str | None = Field(None, max_length=2)
    results: list[CandidateResultSchema] = Field(..., min_length=1)
    source_url: HttpUrl


class PollSummarySchema(CamelModel):
    """Schema resumido para listagem de pesquisas."""

    id: str
    institute: InstituteEnum
    published_at: date
    sample_size: int
    margin_of_error: float
    election_type: ElectionTypeEnum
    state: str | None = None
    top_candidate: str
    top_percentage: float


class AggregateResultSchema(CamelModel):
    """Schema para resultado agregado de múltiplas pesquisas."""

    candidate_id: str
    candidate_name: str
    party: str
    weighted_average: float = Field(..., ge=0, le=100)
    confidence_interval: tuple[float, float]
    polls_included: int = Field(..., ge=0)
    last_updated: datetime
    trend: TrendEnum
    trend_value: float


class CandidateSchema(CamelModel):
    """Schema para dados de candidato."""

    id: str
    name: str
    party: str
    photo_url: str = ""
    state: str | None = None


class PollFilterParams(CamelModel):
    """Parâmetros de filtro para busca de pesquisas."""

    institute: InstituteEnum | None = None
    election_type: ElectionTypeEnum | None = None
    state: str | None = Field(None, max_length=2)
    start_date: date | None = None
    end_date: date | None = None
    candidate_id: str | None = None
