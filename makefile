ENV_DEV=.env.dev
ENV_PROD=.env.prod

COMPOSE_DEV=docker-compose.yml
COMPOSE_PROD=docker-compose.prod.yml


dev:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up --build

dev-up:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) up -d

dev-down:
	docker compose --env-file ./$(ENV_DEV) -f $(COMPOSE_DEV) down

prod:
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) up --build

prod-up:
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) up -d

prod-down:
	docker compose --env-file ./$(ENV_PROD) -f $(COMPOSE_PROD) down

logs:
	docker compose logs -f

ps:
	docker compose ps

restart:
	docker compose down
	docker compose --env-file $(ENV_DEV) -f $(COMPOSE_DEV) up --build -d
