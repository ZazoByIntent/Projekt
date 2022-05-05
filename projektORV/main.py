import cv2
import numpy as np #Namesceni za nadaljno uporabo
from numba import jit #Namesceni za nadaljno uporabo

cap = cv2.VideoCapture(0)

if cap.isOpened() == False:
    print("Ne morem odpreti kamere")

cv2.namedWindow("Kamera")

while True:
    ret, frame = cap.read()
    height, width, channels = frame.shape #height -> visina okna, width -> sirina okna
    # https: // towardsdatascience.com / viola - jones - algorithm - and -haar - cascade - classifier - ee3bfb19f7d8
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) #Za morebitno potrebno pretvorbo v sivinsko sliko
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml') # Pot do xml file, za klasificiranje značilk
    detected_faces = face_cascade.detectMultiScale(gray) # Funkcija vrača listo "obrazov" s koordinatami x,y,w,h (za pravokotnik)
    counter_faces=0 #Stevec zaznanih obrazov
    for (x,y,w,h) in detected_faces: # x,y zacetna pozicija, w širina obraza, h višina obraza
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 4) # Pravokotnik za izris kje se nahaja obraz
        counter_faces=counter_faces+1 #Pristejemo po vsaki iteraciji
        if(counter_faces==1): # Da nam zaznavamo samo 1 obraz naenx, breakamo pravočasno
            break
    if ret == True:
        cv2.imshow("Kamera", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break
cap.release()
cv2.destroyAllWindows()
