dev:
	@docker-compose -f docker-compose.development.yml up --build --force-recreate

prod:
	@docker-compose -f docker-compose.production.yml up --build --force-recreate
