install-bun:
	@command -v bun >/dev/null 2>&1 && { \
		echo "Bun is already installed."; \
	} || { \
		echo "Bun is not installed. Installing..."; \
		command -v npm >/dev/null 2>&1 || { echo >&2 "Error: 'npm' is required but not installed."; exit 1; }; \
		npm install -g bun; \
	}

install-deps:
	bun install

install:
	make install-bun \
	&& make install-deps \
	&& bun run db:generate \
	&& bun run db:push

dev:
	bun run dev
