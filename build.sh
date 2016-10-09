#webui
npm run build-prod

#gobackend
go build backend.go

#iotserver

git clone git@bitbucket.org:pawwik/iot_server.git -b oic tmp/iot_server
git clone git@bitbucket.org:pawwik/liboic.git tmp/liboic
git clone git@bitbucket.org:pawwik/libcoap.git tmp/libcoap
git clone git@bitbucket.org:pawwik/std.git tmp/std
git clone git@bitbucket.org:pawwik/rfm69-driver.git tmp/rfm69-driver

docker-compose build
