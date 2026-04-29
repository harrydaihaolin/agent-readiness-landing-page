.PHONY: install dev build preview test lint format clean self-scan

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

test:
	npm test

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf node_modules dist coverage

self-scan:
	agent-readiness scan . --fail-below 95
