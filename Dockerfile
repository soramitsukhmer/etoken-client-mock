FROM hayd/alpine-deno:latest

USER deno
WORKDIR /app
ADD . /app

RUN deno cache --unstable mod.ts

EXPOSE 44331

CMD ["run", "--allow-net", "--unstable", "mod.ts"]
