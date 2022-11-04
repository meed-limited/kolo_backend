docker buildx build --platform linux/amd64 -t gcr.io/kolo-hack/kolo:0.0.1 .

docker push gcr.io/kolo-hack/kolo:0.0.1

gcloud run deploy --image gcr.io/kolo-hack/kolo:0.0.1