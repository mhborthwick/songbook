start-db:
	@cd backend; \
	docker compose up

start-backend:
	@cd backend; \
	yarn dev

start-frontend:
	@cd frontend; \
	yarn dev
