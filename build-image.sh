npm run build-prod
docker build -t iot-webui -f Dockerfile-webui .
go build backend.go
docker build -t iot-backend -f Dockerfile-gobackend .

