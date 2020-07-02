FROM hayd/deno:latest

WORKDIR /app
ADD . /app

EXPOSE 44331
CMD ["run", "--allow-net", "--unstable", "mod.ts"]
