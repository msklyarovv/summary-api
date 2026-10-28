.PHONY: help up down build logs shell db-studio deploy

# ─── Локальная разработка ──────────────────────────────────────────────────────
up: ## Запустить приложение локально
	docker-compose up --build

up-d: ## Запустить в фоне
	docker-compose up --build -d

down: ## Остановить и удалить контейнеры + volumes
	docker-compose down -v

logs: ## Следить за логами API
	docker-compose logs -f api

shell: ## Зайти в контейнер API
	docker-compose exec api sh

db-studio: ## Открыть Prisma Studio
	docker-compose exec api npx prisma studio

# ─── Production ────────────────────────────────────────────────────────────────
prod-up: ## Запустить production-стек (nginx + ssl)
	docker-compose -f docker-compose.prod.yml up --build -d

prod-down: ## Остановить production-стек
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Логи production
	docker-compose -f docker-compose.prod.yml logs -f

# ─── Deploy (запускать на сервере) ─────────────────────────────────────────────
deploy: ## Обновить приложение на сервере (git pull + rebuild)
	git pull origin main
	docker-compose -f docker-compose.prod.yml up --build -d --no-deps api
	docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

ssl-init: ## Сгенерировать self-signed сертификат (до получения Let's Encrypt)
	mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/ssl/selfsigned.key \
		-out nginx/ssl/selfsigned.crt \
		-subj "/CN=localhost"

help: ## Показать справку
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
