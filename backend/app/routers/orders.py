import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order, OrderItem, Fish
from app.schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Shopping cart is empty")

    order_num = f"AQV-{random.randint(10000, 99999)}"

    total_amount = 0.0
    order_items_to_create = []

    for item in order_in.items:
        fish = db.query(Fish).filter(Fish.id == item.fish_id).first()
        if not fish:
            raise HTTPException(status_code=404, detail=f"Fish with ID {item.fish_id} not found")

        unit_price = fish.discount_price if fish.discount_price else fish.price
        total_amount += unit_price * item.quantity

        order_items_to_create.append(OrderItem(
            fish_id=fish.id,
            fish_name=fish.name,
            quantity=item.quantity,
            unit_price=unit_price
        ))

    packaging_fee = 15.00  # Insulated oxygen thermobox in USD
    total_amount += packaging_fee

    new_order = Order(
        order_number=order_num,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_address=order_in.customer_address,
        delivery_method=order_in.delivery_method or "Insulated Oxygen Thermobox (48h safe)",
        delivery_date=order_in.delivery_date or "Earliest Express Schedule",
        total_amount=round(total_amount, 2),
        status="Processing (Oxygen Thermobox Packing)",
        notes=order_in.notes
    )

    db.add(new_order)
    db.flush()

    for oi in order_items_to_create:
        oi.order_id = new_order.id
        db.add(oi)

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/{order_number}", response_model=OrderResponse)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
