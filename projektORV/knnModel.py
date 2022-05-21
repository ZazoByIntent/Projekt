import cv2
import numpy

class imageObject:
    normalizedHist = []
    lbpList = []
    label = 0 #1 za psa, 0 za mačko

def trainKNN(imageObjectList):
    tempLabels = []
    tempSamples = []
    labels = []
    samples = []
    samplesMain = []
    labelsMain = []

    knn = cv2.ml.KNearest_create()
    
    #svm.setGamma(5.383)
    #svm.setC(2.67)

    for i in range(0, len(imageObjectList), 1):
        tempList = []
        for z in range(0, len(imageObjectList[i].normalizedHist),1):
            tempList.append(imageObjectList[i].normalizedHist[z])
        for z in range(0, len(imageObjectList[i].lbpList),1):
            tempList.append(imageObjectList[i].lbpList[z])
        samplesMain.append(tempList)
        labelsMain.append(imageObjectList[i].label)


    '''
    for i in range(0, len(samplesMain), 1):
        tempSamples.append(samplesMain[i])

    for i in range(0, len(labelsMain), 1):
        tempSamples.append(labelsMain[i])
    '''
    labels = numpy.array(labelsMain)
    samples = numpy.float32(samplesMain)

    #print(samples)

    knn.train(samples, cv2.ml.ROW_SAMPLE, labels)
    knn.save('knn_data.dat')
    print("Knn done")
def checkKNN(sampleMainObjectList):
    knn = cv2.ml.KNearest_load("knn_data.dat")
    result = 0
    countCat = 0
    pravilnoCat = 0
    countDog = 0
    pravilnoDog = 0
    for i in range(0, len(sampleMainObjectList), 1):
        tempList = []
        for z in range(0, len(sampleMainObjectList[i].normalizedHist),1):
            tempList.append(sampleMainObjectList[i].normalizedHist[z])
        for z in range(0, len(sampleMainObjectList[i].lbpList),1):
            tempList.append(sampleMainObjectList[i].lbpList[z])
        tempCat = 0
        tempDog = 0
        sample = numpy.float32(tempList)
        ret, res, neighbours, distance = knn.findNearest(sample.reshape(1, -1), 5)
        if(sampleMainObjectList[i].label == 1):
            countDog += 1
        else:
            countCat += 1

        if(sampleMainObjectList[i].label == int(res[0][0])):
            if(sampleMainObjectList[i].label == 1):
                pravilnoDog += 1
            else:
                pravilnoCat += 1
        #print(resp[1])
        #print(str(sampleMainObjectList[i].label) + " " + str(resp[1].ravel()[0]))
        #print("This object is " + str(sampleMainObjectList[i].label) + " and the prediction was " + str(res[0][0]))

    procentCat = (float(pravilnoCat) / float(countCat)) * 100
    procentDog = (float(pravilnoDog) / float(countDog)) * 100

    print("kNN Model")
    print("Procent pravilen cat: " + str(procentCat) + "%")
    print("Procent pravilen dog: " + str(procentDog) + "%")
    return None