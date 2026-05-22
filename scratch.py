import urllib.request, json
url = "https://api.themoviedb.org/3/movie/1439930?append_to_response=videos,credits,similar&api_key=ff51f94da53ecfd4393e38a0f0112315&language=en-US"
try:
    res = urllib.request.urlopen(url)
    data = json.loads(res.read())
    print("Success, keys:", data.keys())
except Exception as e:
    print("Error:", e)
