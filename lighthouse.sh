url="$1"
key="$2"

rm -f "./out/$key.json"
touch "./out/$key.json"

lighthouse "$url" --only-categories accessibility --output json --chrome-flags="--headless" --output-path "./out/$key.json"