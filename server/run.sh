docker stop invisible || true
docker rm invisible || true
docker build -t invisible .
docker run -d -p 3005:3030 -v $(pwd):/app --name invisible --restart always invisible
docker image prune -f