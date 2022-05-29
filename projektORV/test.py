import sys
import json

photos = json.loads(sys.argv[2])
print(str("Login file: " + sys.argv[1] + " registration files: "))

for photo in photos:
    print(str(photo['path']))

#če je 1 = out ,če je 0 pa karkol druga