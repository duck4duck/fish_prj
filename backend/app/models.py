import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Fish(Base):
    __tablename__ = "fishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    scientific_name = Column(String(150), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    water_type = Column(String(50), nullable=False)  # "Marine" or "Freshwater"
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    image_url = Column(String(500), nullable=False)
    
    # Aquatic parameters
    temp_min = Column(Float, nullable=False, default=24.0)
    temp_max = Column(Float, nullable=False, default=28.0)
    ph_min = Column(Float, nullable=False, default=6.5)
    ph_max = Column(Float, nullable=False, default=7.5)
    min_tank_liters = Column(Integer, nullable=False, default=60)
    
    temperament = Column(String(100), nullable=False)  # Peaceful, Schooling, Solitary, Semi-territorial
    care_level = Column(String(50), nullable=False)    # Easy, Medium, Expert
    diet = Column(String(100), nullable=False)          # Omnivore, Herbivore, Carnivore
    
    description = Column(Text, nullable=False)
    care_tips = Column(Text, nullable=True)
    origin = Column(String(150), nullable=True)
    badge = Column(String(50), nullable=True)          # Best Seller, Exclusive, Choice of the Year
    
    in_stock = Column(Boolean, default=True)
    stock_count = Column(Integer, default=15)
    rating = Column(Float, default=4.9)
    reviews_count = Column(Integer, default=12)
    is_featured = Column(Boolean, default=False)
    
    reviews = relationship("Review", back_populates="fish", cascade="all, delete-orphan")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    customer_address = Column(String(250), nullable=False)
    delivery_method = Column(String(100), default="Aqua-Thermobox with pure O2 (48h safe)")
    delivery_date = Column(String(100), nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="Processing (Oxygen Thermobox Packing)")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    fish_id = Column(Integer, ForeignKey("fishes.id"), nullable=True)
    fish_name = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    fish_id = Column(Integer, ForeignKey("fishes.id"), nullable=False)
    author_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False, default=5)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    fish = relationship("Fish", back_populates="reviews")
