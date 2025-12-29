from .users import router as users_router
from .projects import router as projects_router
from .products import router as products_router
from .companies import router as companies_router
from .orders import router as orders_router
from .categories import router as categories_router

# Tạo một list chứa tất cả
all_routers = [users_router, projects_router, products_router, companies_router, orders_router, categories_router]