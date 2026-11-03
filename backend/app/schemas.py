import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    author_name: str = Field(..., min_length=2, max_length=100)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=3, max_length=1000)

class ReviewResponse(BaseModel):
    id: int
    fish_id: int
    author_name: str
    rating: int
    comment: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class FishBase(BaseModel):
    name: str
    scientific_name: Optional[str] = None
    category: str
    water_type: str
    price: float
    discount_price: Optional[float] = None
    image_url: str
    temp_min: float
    temp_max: float
    ph_min: float
    ph_max: float
    min_tank_liters: int
    temperament: str
    care_level: str
    diet: str
    description: str
    care_tips: Optional[str] = None
    origin: Optional[str] = None
    badge: Optional[str] = None
    in_stock: bool = True
    stock_count: int = 10
    rating: float = 5.0
    reviews_count: int = 0
    is_featured: bool = False

class FishResponse(FishBase):
    id: int
    reviews: List[ReviewResponse] = []

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    fish_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2)
    customer_phone: str = Field(..., min_length=5)
    customer_address: str = Field(..., min_length=5)
    delivery_method: Optional[str] = "Aqua-Thermobox with pure O2 (48h safe)"
    delivery_date: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    fish_id: Optional[int]
    fish_name: str
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    customer_address: str
    delivery_method: str
    delivery_date: Optional[str]
    total_amount: float
    status: str
    notes: Optional[str]
    created_at: datetime.datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# Aquarium compatibility schema
class CompatibilityRequest(BaseModel):
    fish_ids: List[int]

class CompatibilityIssue(BaseModel):
    type: str  # "danger", "warning", "info"
    title: str
    message: str

class CompatibilityResponse(BaseModel):
    is_compatible: bool
    status: str  # "Ideal Compatibility", "Minor Conflict", "Critical Incompatibility"
    score: int   # 0 to 100
    recommendation: str
    temp_range: str
    ph_range: str
    min_tank_liters: int
    issues: List[CompatibilityIssue]
    fishes: List[FishResponse]
