DENO_FLAGS=--allow-net --unstable

build:
	docker build . -t etoken

run: build
	docker run -p "44331:44331" --rm etoken
