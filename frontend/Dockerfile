# 1. Nâng cấp lên Node 22-alpine (Bản LTS mới nhất, ổn định hơn v18/v20)
# Node v25 là bản "nghịch", không nên dùng cho Docker production.
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# 2. BƯỚC SỬA LỖI QUAN TRỌNG:
# Thêm --legacy-peer-deps để bỏ qua lỗi xung đột React 19
RUN npm install --legacy-peer-deps

COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]