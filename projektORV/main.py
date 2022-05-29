import os, time
import numpy


directory = "C:\\Users\\Luka\\Desktop\\uploads"
numberOfFiles = 0
waitTime = 10

while(True):
    numberOfFiles = len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])
    print(numberOfFiles)

    time.sleep(waitTime)
    





