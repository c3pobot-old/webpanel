dir=`pwd`
dir="$(basename $dir)"
echo "Building $dir ..."
docker build -f Dockerfile.prod -t registry.gitlab.com/c3po-shard/$dir:latest .
docker push registry.gitlab.com/c3po-shard/$dir:latest
