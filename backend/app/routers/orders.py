from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from app.models import Order, CreateOrderRequest, Product, OrderItem

router = APIRouter(
    prefix="/orders",    # Tự động thêm /orders vào trước mọi API trong file này
    tags=["orders"]
)

# ... (rest of the file)

@router.post("/", response_model=Order, status_code=201)
async def create_order(request: CreateOrderRequest):
    """
    Create a new order from a customer request.
    Fetches product details to ensure valid prices and data.
    """
    order_items = []
    total_amount = 0.0

    # 1. Validate and fetch products
    for item_req in request.items:
        product = await Product.get(item_req.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {item_req.product_id}")
        
        # Create OrderItem snapshot
        order_item = OrderItem(
            product_name=product.name,
            product_id=str(product.id),
            quantity=item_req.quantity,
            price_at_purchase=product.price
        )
        order_items.append(order_item)
        total_amount += product.price * item_req.quantity

    # 2. Create Order document
    new_order = Order(
        customer_name=request.customer_info.name,
        customer_phone=request.customer_info.phone,
        customer_email=request.customer_info.email,
        customer_address=request.customer_info.address,
        items=order_items,
        total_amount=total_amount,
        status="pending"
    )
    
    await new_order.insert()
    return new_order

@router.get("/", response_model=List[Order])
async def get_all_orders(
    status: Optional[str] = Query(None, description="Filter orders by status"),
    search: Optional[str] = Query(None, description="Search by customer name or phone number")
):
    """Retrieve all orders with optional filtering."""
    query_filter = {}
    
    if status:
        query_filter["status"] = status
        
    if search:
        query_filter["$or"] = [
            {"customer_name": {"$regex": search, "$options": "i"}},
            {"customer_phone": {"$regex": search, "$options": "i"}}
        ]
        
    orders = await Order.find(query_filter).to_list()
    return orders