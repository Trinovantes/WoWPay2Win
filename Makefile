print-%: ; @echo $*=$($*)

-include .env
export

export DOCKER_BUILDKIT          := 1
export COMPOSE_DOCKER_CLI_BUILD := 1

web-dockerfile = ./docker/Dockerfile.web
web-container = wowpay2win-web
web-image = ghcr.io/trinovantes/$(web-container)

cron-dockerfile = ./docker/Dockerfile.cron
cron-container = wowpay2win-cron
cron-image = ghcr.io/trinovantes/$(cron-container)

.PHONY: build-cron build-web stop-cron stop-web run-cron run-web pull push clean

# -----------------------------------------------------------------------------
# Cron
# -----------------------------------------------------------------------------

build-cron:
	docker build \
		--file $(cron-dockerfile) \
		--tag $(cron-image) \
		--progress=plain \
		--target=cron \
		.

	mkdir -p ./dist
	$(eval TEMP_CONTAINER=$(shell docker create $(cron-image)))
	docker cp $(TEMP_CONTAINER):/app/dist/cron ./dist/cron
	docker rm $(TEMP_CONTAINER)

stop-cron:
	docker stop $(cron-container) || true
	docker rm $(cron-container) || true

run-cron: stop-cron
	docker run \
		--env-file .env \
		--mount type=bind,source=/var/www/wowpay2win/auctions,target=/app/dist/web/data \
		--mount type=bind,source=/var/www/wowpay2win/gamedata,target=/app/src/web/assets/data \
		--log-driver local \
		--restart=always \
		--detach \
		--name $(cron-container) \
		$(cron-image)

# -----------------------------------------------------------------------------
# Web
# -----------------------------------------------------------------------------

build-web:
	docker build \
		--file $(web-dockerfile) \
		--tag $(web-image) \
		--progress=plain \
		--target=web \
		--secret id=CLIENT_ID \
		--secret id=CLIENT_SECRET \
		.

	mkdir -p ./dist
	$(eval TEMP_CONTAINER=$(shell docker create $(web-image)))
	docker cp $(TEMP_CONTAINER):/app/dist/web ./dist/web
	docker rm $(TEMP_CONTAINER)

stop-web:
	docker stop $(web-container) || true
	docker rm $(web-container) || true

run-web: stop-web
	docker run \
		--publish 9003:80 \
		--mount type=bind,source=/var/www/wowpay2win/auctions,target=/app/dist/web/data,readonly \
		--log-driver local \
		--restart=always \
		--detach \
		--name $(web-container) \
		$(web-image)

# -----------------------------------------------------------------------------
# Maintenance
# -----------------------------------------------------------------------------

build: build-web build-cron

run: run-web run-cron

pull:
	docker pull $(web-image) --quiet
	docker pull $(cron-image) --quiet

push:
	docker push $(web-image) --quiet
	docker push $(cron-image) --quiet

clean:
	rm -rf ./dist
	docker container prune -f
	docker image prune -f