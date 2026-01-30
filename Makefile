.PHONY: help start stop logs

help:
	@echo "Castle - Home Data Management"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  help   Show this help message"
	@echo "  start  Start the application (docker compose up -d)"
	@echo "  stop   Stop the application (docker compose down)"
	@echo "  logs   Show application logs (docker compose logs -f)"

start:
	docker compose up -d --build

stop:
	docker compose down

logs:
	docker compose logs -f
