import cv2
import numpy as np #Namesceni za nadaljno uporabo
from numba import jit #Namesceni za nadaljno uporabo

cap = cv2.VideoCapture(0)

if cap.isOpened() == False:
    print("Ne morem odpreti kamere")

cv2.namedWindow("Kamera")

while True:
    ret, frame = cap.read()
    height, width, channels = frame.shape
    if ret == True:
        cv2.imshow("Kamera", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break
cap.release()
cv2.destroyAllWindows()
