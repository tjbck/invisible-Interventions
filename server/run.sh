docker stop invisible-sfu || true
docker rm invisible-sfu || true
docker build -t invisible-sfu .
docker run -d -p 3000:3030 --name invisible-sfu --restart always invisible-sfu
docker image prune -f