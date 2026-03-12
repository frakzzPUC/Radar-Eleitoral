"""Router para endpoints de pesquisas eleitorais."""

from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.schemas.poll_schema import (
    ElectionTypeEnum,
    InstituteEnum,
    PollSchema,
    PollSummarySchema,
)
from app.services.seed_data import SEED_POLLS

router = APIRouter(prefix="/polls", tags=["Pesquisas"])


@router.get("/", response_model=list[PollSummarySchema])
async def list_polls(
    institute: InstituteEnum | None = Query(None),
    election_type: ElectionTypeEnum | None = Query(None),
    state: str | None = Query(None, max_length=2),
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
) -> list[PollSummarySchema]:
    """Lista pesquisas com filtros opcionais."""
    filtered = SEED_POLLS

    if institute:
        filtered = [p for p in filtered if p.institute.value == institute.value]
    if election_type:
        filtered = [
            p for p in filtered if p.election_type.value == election_type.value
        ]
    if state:
        filtered = [p for p in filtered if p.state == state]
    if start_date:
        filtered = [p for p in filtered if p.published_at >= start_date]
    if end_date:
        filtered = [p for p in filtered if p.published_at <= end_date]

    summaries: list[PollSummarySchema] = []
    for poll in filtered:
        top = max(poll.results, key=lambda r: r.voting_intention)
        summaries.append(
            PollSummarySchema(
                id=poll.id,
                institute=InstituteEnum(poll.institute.value),
                published_at=poll.published_at,
                sample_size=poll.sample_size,
                margin_of_error=poll.margin_of_error,
                election_type=ElectionTypeEnum(poll.election_type.value),
                state=poll.state,
                top_candidate=top.candidate_name,
                top_percentage=top.voting_intention,
            )
        )

    return summaries


@router.get("/{poll_id}", response_model=PollSchema)
async def get_poll(poll_id: str) -> PollSchema:
    """Retorna uma pesquisa completa pelo ID."""
    for poll in SEED_POLLS:
        if poll.id == poll_id:
            return PollSchema(
                id=poll.id,
                institute=InstituteEnum(poll.institute.value),
                published_at=poll.published_at,
                fieldwork_start=poll.fieldwork_start,
                fieldwork_end=poll.fieldwork_end,
                sample_size=poll.sample_size,
                margin_of_error=poll.margin_of_error,
                confidence_level=poll.confidence_level,
                election_type=ElectionTypeEnum(poll.election_type.value),
                state=poll.state,
                results=[
                    {
                        "candidate_id": r.candidate_id,
                        "candidate_name": r.candidate_name,
                        "party": r.party,
                        "voting_intention": r.voting_intention,
                        "valid_votes": r.valid_votes,
                        "spontaneous": r.spontaneous,
                        "rejection": r.rejection,
                    }
                    for r in poll.results
                ],
                source_url=poll.source_url,
            )

    raise HTTPException(status_code=404, detail="Pesquisa não encontrada")
