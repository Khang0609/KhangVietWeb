# 1. Dùng Python bản nhỏ gọn (slim)
FROM python:3.9-slim

# 2. Tạo thư mục làm việc
WORKDIR /app

# 3. Copy file thư viện vào
COPY requirements.txt .

# ----------------------------------------------------------------------
# BƯỚC SỬA TRIỆT ĐỂ: Cài đặt Compiler VÀ các file header Python
# ----------------------------------------------------------------------
RUN apt-get update && \
    apt-get install -y build-essential gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Chú ý: Đảm bảo apt-get đã chạy xong rồi mới chạy pip install
# Lệnh pip install --no-cache-dir -r requirements.txt (Giữ nguyên)
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy code và các bước còn lại giữ nguyên...
COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]