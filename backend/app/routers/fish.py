from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Fish, Review
from app.schemas import FishResponse, ReviewCreate, ReviewResponse

router = APIRouter(prefix="/fish", tags=["Fish Catalog"])

@router.get("", response_model=List[FishResponse])
def get_all_fishes(
    category: Optional[str] = None,
    water_type: Optional[str] = None,
    care_level: Optional[str] = None,
    temperament: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: Optional[bool] = False,
    sort_by: Optional[str] = Query("featured", regex="^(featured|price_asc|price_desc|rating|name)$"),
    db: Session = Depends(get_db)
):
    query = db.query(Fish)

    if category and category != "All":
        query = query.filter(Fish.category == category)
    if water_type and water_type != "All":
        query = query.filter(Fish.water_type == water_type)
    if care_level and care_level != "All":
        query = query.filter(Fish.care_level == care_level)
    if temperament and temperament != "All":
        query = query.filter(Fish.temperament.ilike(f"%{temperament}%"))
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Fish.name.ilike(search_filter),
                Fish.scientific_name.ilike(search_filter),
                Fish.description.ilike(search_filter),
                Fish.category.ilike(search_filter)
            )
        )
    if min_price is not None:
        query = query.filter(Fish.price >= min_price)
    if max_price is not None:
        query = query.filter(Fish.price <= max_price)
    if in_stock_only:
        query = query.filter(Fish.in_stock == True, Fish.stock_count > 0)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Fish.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Fish.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Fish.rating.desc(), Fish.reviews_count.desc())
    elif sort_by == "name":
        query = query.order_by(Fish.name.asc())
    else:
        query = query.order_by(Fish.is_featured.desc(), Fish.id.asc())

    return query.all()

@router.get("/{fish_id}", response_model=FishResponse)
def get_fish_by_id(fish_id: int, db: Session = Depends(get_db)):
    fish = db.query(Fish).filter(Fish.id == fish_id).first()
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found in catalog")
    return fish

@router.post("/{fish_id}/reviews", response_model=ReviewResponse)
def add_review(fish_id: int, review_in: ReviewCreate, db: Session = Depends(get_db)):
    fish = db.query(Fish).filter(Fish.id == fish_id).first()
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")

    review = Review(
        fish_id=fish.id,
        author_name=review_in.author_name,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(review)
    db.flush()

    # Recalculate fish rating
    all_reviews = db.query(Review).filter(Review.fish_id == fish.id).all()
    avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
    fish.rating = round(avg_rating, 1)
    fish.reviews_count = len(all_reviews)

    db.commit()
    db.refresh(review)
    return review
