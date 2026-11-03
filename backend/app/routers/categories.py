from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Fish

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("")
def get_categories(db: Session = Depends(get_db)):
    results = db.query(
        Fish.category,
        func.count(Fish.id).label("count")
    ).group_by(Fish.category).all()

    water_types = db.query(
        Fish.water_type,
        func.count(Fish.id).label("count")
    ).group_by(Fish.water_type).all()

    total_fishes = db.query(func.count(Fish.id)).scalar()

    return {
        "total": total_fishes,
        "categories": [{"name": r[0], "count": r[1]} for r in results],
        "water_types": [{"name": r[0], "count": r[1]} for r in water_types],
        "temperaments": ["Peaceful", "Schooling", "Playful", "Solitary", "Semi-territorial"],
        "care_levels": ["Easy", "Medium", "Expert"]
    }
