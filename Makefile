print-%: ; @echo $*=$($*)

-include .env
export

export GIT_HASH                 := $(shell git rev-parse HEAD)
export DOCKER_BUILDKIT          := 1
export COMPOSE_DOCKER_CLI_BUILD := 1

# -----------------------------------------------------------------------------
# Vars
# -----------------------------------------------------------------------------

web-dockerfile = ./docker/web.Dockerfile
web-container = wowpay2win-web
web-image = ghcr.io/trinovantes/$(web-container)

cron-dockerfile = ./docker/cron.Dockerfile
cron-container = wowpay2win-cron
cron-image = ghcr.io/trinovantes/$(cron-container)

# -----------------------------------------------------------------------------
# Commands
# -----------------------------------------------------------------------------

.PHONY: \
	build-cron stop-cron run-cron \
	build-web stop-web run-web \
	pull push clean all

all: build run

build: \
	build-cron \
	build-web

stop: \
	stop-cron \
	stop-web

run: \
	run-cron \
	run-web

pull:
	docker pull $(cron-image) --quiet
	docker pull $(web-image) --quiet

push:
	docker push $(cron-image) --quiet
	docker push $(web-image) --quiet

clean:
	rm -rf ./dist ./node_modules/.cache
	docker container prune -f
	docker image prune -f

sentry:
	rm -rf ./dist
	mkdir -p ./dist

	$(eval TEMP_CONTAINER=$(shell sh -c "docker create ${web-image}"))
	docker cp $(TEMP_CONTAINER):/app/dist/. ./dist
	docker rm $(TEMP_CONTAINER)

	$(eval TEMP_CONTAINER=$(shell sh -c "docker create ${cron-image}"))
	docker cp $(TEMP_CONTAINER):/app/dist/. ./dist
	docker rm $(TEMP_CONTAINER)

	yarn sentry-cli sourcemaps upload --release=$(GIT_HASH) ./dist

# -----------------------------------------------------------------------------
# Cron
# -----------------------------------------------------------------------------

cron: build-cron run-cron

build-cron:
	docker build \
		--file $(cron-dockerfile) \
		--tag $(cron-image) \
		--progress=plain \
		--secret id=GIT_HASH \
		.

stop-cron:
	docker stop $(cron-container) || true
	docker rm $(cron-container) || true

run-cron: stop-cron
	docker run \
		--env-file .env \
		--mount type=bind,source=/var/www/wowpay2win/auctions,target=/app/dist/web/data \
		--mount type=bind,source=/var/www/wowpay2win/gamedata,target=/app/src/web/client/assets/data \
		--log-driver local \
		--restart=always \
		--detach \
		--name $(cron-container) \
		$(cron-image)

# -----------------------------------------------------------------------------
# Web
# -----------------------------------------------------------------------------

web: build-web run-web

build-web:
	docker build \
		--file $(web-dockerfile) \
		--tag $(web-image) \
		--progress=plain \
		--secret id=CLIENT_ID \
		--secret id=CLIENT_SECRET \
		--secret id=GIT_HASH \
		.

stop-web:
	docker stop $(web-container) || true
	docker rm $(web-container) || true

run-web: stop-web
	docker run \
		--publish 9030:80 \
		--mount type=bind,source=/var/www/wowpay2win/auctions,target=/app/dist/web/data,readonly \
		--network nginx-network \
		--log-driver local \
		--restart=always \
		--detach \
		--name $(web-container) \
		$(web-image)
