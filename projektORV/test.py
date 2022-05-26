import sys
import json

photos = json.loads(sys.argv[2])
print(str("Login file: " + sys.argv[1] + " registration files: "))

for photo in photos:
    print(str(photo['path']))