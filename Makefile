start_db:
	cd backend; \
	docker compose up

start_backend:
	cd backend; \
	yarn dev

start_frontend:
	cd frontend; \
	yarn dev
