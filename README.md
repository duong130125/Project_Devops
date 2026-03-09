# 🚀 DevOps TodoList - Fullstack Application

Ứng dụng TodoList đơn giản: **ReactJS + Spring Boot + PostgreSQL**
Dùng cho bài thực hành DevOps - Rikkei Education.

---

## 📁 Cấu trúc dự án

```
devops-todolist/
├── frontend/              # ReactJS (Vite + Nginx)
│   ├── src/               # Source code React
│   ├── Dockerfile         # Multi-stage build
│   └── nginx.conf         # Nginx cho FE container
├── backend/               # Spring Boot API
│   ├── src/               # Source code Java
│   ├── Dockerfile         # OpenJDK 17
│   └── pom.xml            # Maven dependencies
├── nginx/
│   └── default.conf       # Reverse Proxy config
├── docker-compose.yml     # Orchestration (FE + BE + DB)
├── .github/workflows/
│   └── deploy.yml         # CI/CD Pipeline
└── README.md
```

---

## 🛠️ HƯỚNG DẪN TỪNG BƯỚC (Cho người mới)

### Bước 0: Chuẩn bị trên máy Windows

**Push code lên GitHub:**
```bash
# Mở terminal trong thư mục devops-todolist

# Khởi tạo git repo
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: TodoList fullstack app"

# Tạo repo mới trên GitHub (trên web github.com), sau đó:
git remote add origin https://github.com/YOUR_USERNAME/devops-todolist.git
git branch -M main
git push -u origin main
```

> ⚠️ Thay `YOUR_USERNAME` bằng username GitHub của bạn.

---

### Bước 1: SSH vào Server

```bash
# Trên máy Windows, mở PowerShell hoặc Terminal
ssh -i "path/to/private-key.pem" ubuntu@54.169.147.214

# Ví dụ:
ssh -i "C:\Users\Admin\Downloads\key.pem" ubuntu@54.169.147.214
```

> Nếu lỗi permission key, chạy trước:
> ```bash
> chmod 400 path/to/private-key.pem   # Trên Linux/Mac
> ```

---

### Bước 2: Cài đặt Docker & Docker Compose trên Server

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Docker
sudo apt install -y docker.io

# Khởi động Docker và set auto-start
sudo systemctl start docker
sudo systemctl enable docker

# Thêm user ubuntu vào group docker (để chạy docker không cần sudo)
sudo usermod -aG docker ubuntu

# ⚠️ QUAN TRỌNG: Logout rồi SSH lại để group có hiệu lực
exit
# SSH lại vào server
ssh -i "path/to/private-key.pem" ubuntu@54.169.147.214

# Kiểm tra Docker đã hoạt động
docker --version
docker compose version
```

---

### Bước 3: Clone code từ GitHub

```bash
# Clone repo về server
cd ~
git clone https://github.com/YOUR_USERNAME/devops-todolist.git

# Vào thư mục project
cd devops-todolist
```

---

### Bước 4: Chạy ứng dụng với Docker Compose

```bash
# Build và chạy tất cả 3 containers (DB + Backend + Frontend)
docker compose up -d --build

# Chờ khoảng 1-2 phút để build xong...

# Kiểm tra containers đang chạy
docker compose ps

# Xem logs nếu cần debug
docker compose logs -f          # Xem tất cả logs
docker compose logs -f backend  # Chỉ xem logs backend
docker compose logs -f db       # Chỉ xem logs database
```

**Kết quả mong đợi từ `docker compose ps`:**
```
NAME                STATUS              PORTS
todoapp-db          Up (healthy)        5432/tcp        ← Không expose ra ngoài!
todoapp-backend     Up                  0.0.0.0:8080->8080/tcp
todoapp-frontend    Up                  0.0.0.0:3000->3000/tcp
```

**Kiểm tra nhanh:**
```bash
# Test Backend API
curl http://localhost:8080/api/todos
# Phải trả về: []

# Test Frontend
curl -I http://localhost:3000
# Phải trả về: HTTP/1.1 200 OK
```

---

### Bước 5: Cài đặt Nginx Reverse Proxy trên Server

```bash
# Cài Nginx
sudo apt install -y nginx

# Copy config file
sudo cp ~/devops-todolist/nginx/default.conf /etc/nginx/sites-available/todoapp.conf

# Tạo symlink để kích hoạt
sudo ln -sf /etc/nginx/sites-available/todoapp.conf /etc/nginx/sites-enabled/todoapp.conf

# Xóa config mặc định (tránh xung đột)
sudo rm -f /etc/nginx/sites-enabled/default

# Kiểm tra cú pháp nginx
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
sudo systemctl enable nginx

# Kiểm tra Nginx đang chạy
sudo systemctl status nginx
```

**Kiểm tra qua Domain:**
- Mở trình duyệt: `http://nguyen-trung-hieu2-k23.rikkeieducation.com` → Thấy TodoList UI
- Test API: `http://nguyen-trung-hieu2-k23.rikkeieducation.com/api/todos` → Thấy JSON `[]`

---

### Bước 6: Cấu hình CI/CD (GitHub Actions)

**Trên GitHub, vào repo → Settings → Secrets and variables → Actions → New repository secret:**

| Secret Name       | Giá trị                                |
|--------------------|----------------------------------------|
| `SERVER_HOST`      | `54.169.147.214`                       |
| `SERVER_USERNAME`  | `ubuntu`                               |
| `SERVER_SSH_KEY`   | Nội dung file private key (copy toàn bộ) |

**Cách lấy nội dung private key để paste:**
```bash
# Trên máy Windows (PowerShell):
cat C:\Users\Admin\Downloads\key.pem

# Copy TOÀN BỘ output bao gồm cả:
# -----BEGIN RSA PRIVATE KEY-----
# ...
# -----END RSA PRIVATE KEY-----
```

**Test CI/CD:**
```bash
# Trên máy Windows, sửa bất kỳ file nào rồi push
git add .
git commit -m "Test CI/CD"
git push origin main

# Vào GitHub → tab Actions → xem pipeline chạy
```

---

## 🔧 Các lệnh hữu ích

### Docker Compose
```bash
docker compose up -d --build   # Build + chạy tất cả
docker compose down            # Dừng tất cả containers
docker compose ps              # Xem containers đang chạy
docker compose logs -f         # Xem logs real-time
docker compose restart backend # Restart 1 service
```

### Docker
```bash
docker ps                      # Xem containers đang chạy
docker images                  # Xem danh sách images
docker exec -it todoapp-db psql -U postgres -d rikkei_prod  # Vào DB
docker image prune -f          # Dọn images không dùng
```

### Nginx
```bash
sudo nginx -t                  # Kiểm tra cú pháp config
sudo systemctl reload nginx    # Reload config
sudo systemctl status nginx    # Kiểm tra trạng thái
sudo cat /var/log/nginx/error.log  # Xem logs lỗi
```

### Kiểm tra Database persist
```bash
# Thêm 1 todo qua API
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test persist data"}'

# Restart container DB
docker compose restart db

# Kiểm tra data vẫn còn
curl http://localhost:8080/api/todos
# → Phải thấy todo "Test persist data" vẫn còn!
```

---

## ❗ Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|------|------------|----------|
| Backend không kết nối DB | Container DB chưa sẵn sàng | `docker compose logs db` → chờ "ready to accept connections" |
| Port 8080/3000 bị chiếm | Có service khác chạy | `sudo lsof -i :8080` → `kill PID` |
| Nginx 502 Bad Gateway | Backend/Frontend chưa chạy | `docker compose ps` → kiểm tra status |
| Permission denied Docker | User chưa thuộc group docker | `sudo usermod -aG docker ubuntu` → logout/login lại |
| Git push bị denied | Chưa cấu hình SSH key GitHub | Dùng HTTPS hoặc `ssh-keygen` → thêm key vào GitHub |

---

## 📊 Kiến trúc tổng quan

```
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │   Nginx (OS)    │  Port 80
              │  Reverse Proxy  │
              └────────┬────────┘
                 ┌─────┴─────┐
                 ▼           ▼
          ┌──────────┐ ┌──────────┐
          │ Frontend │ │ Backend  │
          │  React   │ │ Spring   │
          │ (Nginx)  │ │  Boot    │
          │ :3000    │ │ :8080    │
          └──────────┘ └────┬─────┘
                            │
                       ┌────▼─────┐
                       │PostgreSQL│
                       │  :5432   │
                       │(internal)│
                       └──────────┘
                    Docker Network
```

---

**Made with ❤️ for Rikkei Education DevOps Practice**
