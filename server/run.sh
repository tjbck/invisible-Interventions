docker stop invisible || true
docker rm invisible || true
docker build -t invisible .
docker run -d -p 3000:3030 -v $(pwd):/app/sql_app.db --name invisible --restart always invisible
docker image prune -f