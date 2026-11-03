from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Fish
from app.schemas import CompatibilityRequest, CompatibilityResponse
from app.utils.aquarium_compat import check_fish_compatibility

router = APIRouter(prefix="/compatibility", tags=["Aquarium Compatibility Checker"])

@router.post("", response_model=CompatibilityResponse)
def check_compatibility(req: CompatibilityRequest, db: Session = Depends(get_db)):
    if not req.fish_ids:
        return check_fish_compatibility([])

    fishes = db.query(Fish).filter(Fish.id.in_(req.fish_ids)).all()
    if len(fishes) != len(req.fish_ids):
        # some fish not found, but we can still proceed with found ones
        pass

    return check_fish_compatibility(fishes)
