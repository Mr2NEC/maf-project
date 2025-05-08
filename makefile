ENV_DEV=.env.dev
ENV_PROD=.env.prod

COMPOSE_DEV=docker-compose.yml
COMPOSE_PROD=docker-compose.prod.yml

# Development commands
dev:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up --build

dev-up:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up -d

dev-down:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) down

# Database commands
db-up:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up -d mysql

db-down:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) stop mysql

# Backend commands
backend-up:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up -d backend

backend-down:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) stop backend

# Frontend commands
frontend-up:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up -d frontend

frontend-down:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) stop frontend

# Production commands
prod:
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) up --build

prod-up:
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) up -d

prod-down:
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) down

# Utility commands
logs:
	docker compose logs -f

ps:
	docker compose ps

restart:
	docker compose down
	docker compose --env-file $(ENV_DEV) -f $(COMPOSE_DEV) up --build -d

# Cleanup commands
clean-all:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) down -v
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) down -v
	docker system prune -af --volumes
