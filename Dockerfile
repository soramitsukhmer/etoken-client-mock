FROM hayd/deno:latest

WORKDIR /app
ADD . /app

RUN deno cache mod.ts

EXPOSE 44331
CMD ["run", "--allow-net", "--unstable", "mod.ts"]
