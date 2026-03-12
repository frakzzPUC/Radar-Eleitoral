"""Router para endpoints de candidatos."""

from fastapi import APIRouter, HTTPException

from app.schemas.poll_schema import CandidateSchema
from app.services.seed_data import CANDIDATES, SEED_POLLS

router = APIRouter(prefix="/candidates", tags=["Candidatos"])


@router.get("/", response_model=list[CandidateSchema])
async def list_candidates() -> list[CandidateSchema]:
    """Lista todos os candidatos registrados."""
    return [
        CandidateSchema(
            id=c.id,
            name=c.name,
            party=c.party,
            photo_url=c.photo_url,
            state=c.state,
        )
        for c in CANDIDATES
    ]


@router.get("/{candidate_id}", response_model=CandidateSchema)
async def get_candidate(candidate_id: str) -> CandidateSchema:
    """Retorna dados de um candidato pelo ID."""
    for c in CANDIDATES:
        if c.id == candidate_id:
            return CandidateSchema(
                id=c.id,
                name=c.name,
                party=c.party,
                photo_url=c.photo_url,
                state=c.state,
            )

    raise HTTPException(status_code=404, detail="Candidato não encontrado")


@router.get("/{candidate_id}/polls")
async def get_candidate_polls(candidate_id: str) -> list[dict]:
    """Retorna o histórico de pesquisas de um candidato específico."""
    candidate = next((c for c in CANDIDATES if c.id == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato não encontrado")

    history: list[dict] = []
    for poll in SEED_POLLS:
        for result in poll.results:
            if result.candidate_id == candidate_id:
                history.append({
                    "poll_id": poll.id,
                    "institute": poll.institute.value,
                    "published_at": poll.published_at.isoformat(),
                    "voting_intention": result.voting_intention,
                    "valid_votes": result.valid_votes,
                    "sample_size": poll.sample_size,
                    "margin_of_error": poll.margin_of_error,
                })

    return sorted(history, key=lambda h: h["published_at"])
