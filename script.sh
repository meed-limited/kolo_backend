rm -rf dist

npm run build

docker buildx build --platform linux/amd64 -t gcr.io/kolo-hack/kolo:0.0.2 .

docker push gcr.io/kolo-hack/kolo:0.0.2

gcloud run deploy --image gcr.io/kolo-hack/kolo:0.0.2