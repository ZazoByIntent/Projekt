import cv2
import numpy
import pandas as pd


class imageObject:
    vseZnacilke = []
    label = 0 #1 za sliko uporabnika, 0 za za ostalo

class imageObjectPoslano:
    normalizedHist = []
    lbpList = []
    label = 0 #1 za sliko uporabnika, 0 za za ostalo

def trainSVM(imageObjectList, imageObjectListPoslano):
    tempLabels = []
    tempSamples = []
    labels = []
    samples = []
    samplesMain = []
    labelsMain = []

    svm = cv2.ml.SVM_create()
    svm.setType(cv2.ml.SVM_C_SVC)
    svm.setKernel(cv2.ml.SVM_LINEAR)
    #svm.setGamma(5.383)
    #svm.setC(2.67)
    


    for i in range(0, len(imageObjectList), 1):
        samplesMain.append(imageObjectList[i].vseZnacilke)
        labelsMain.append(imageObjectList[i].label)

    for i in range(0, len(imageObjectListPoslano), 1):
        tempList = []
        for z in range(0, len(imageObjectListPoslano[i].normalizedHist),1):
            tempList.append(imageObjectListPoslano[i].normalizedHist[z])
        for z in range(0, len(imageObjectListPoslano[i].lbpList),1):
            tempList.append(imageObjectListPoslano[i].lbpList[z])
        samplesMain.append(tempList)
        labelsMain.append(imageObjectListPoslano[i].label)
   
    '''
    for i in range(0, len(samplesMain), 1):
        tempSamples.append(samplesMain[i])

    for i in range(0, len(labelsMain), 1):
        tempSamples.append(labelsMain[i])
    

    for i in range(0, 200, 1):
        labelsMain.append(0)
    
    
    
    df = pd.read_csv('data-labels.csv')
    labels = df.to_numpy()
    df = pd.read_csv('data-samples.csv')
    samples = df.to_numpy()

    print(labels[0])
    print(samples)
    
    labels = numpy.array(labelsMain)
    samples = numpy.float32(samplesMain)

    pd.DataFrame(labels).to_csv("data-labels.csv",header=False, index=False)
    pd.DataFrame(samples).to_csv("data-samples.csv",header=False, index=False)
    

    df = pd.read_csv('data-labels.csv')
    labels = df.to_numpy()
    for i in range(0, len(labels), 1):
        labelsMain.append(labels[i][0])
    labels = numpy.array(labelsMain)

    df = pd.read_csv('data-samples.csv')
    samples = df.to_numpy()
    samples = numpy.float32(samples)
    '''
    labels = numpy.array(labelsMain)
    samples = numpy.float32(samples)
    svm.train(samples, cv2.ml.ROW_SAMPLE, labels)
    svm.save('svm_data.dat')
    print("Svm done")

def checkSVM(sampleMainObjectList):
    svm = cv2.ml.SVM_load('svm_data.dat')
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
        sample = numpy.float32(tempList)
        resp = svm.predict(sample.reshape(1, -1))

        if(sampleMainObjectList[i].label == 1):
            countDog += 1

        if(sampleMainObjectList[i].label == int(resp[1].ravel()[0])):
            if(sampleMainObjectList[i].label == 1):
                pravilnoDog += 1
        #print(resp[1])
        #print(str(sampleMainObjectList[i].label) + " " + str(resp[1].ravel()[0]))
        #print("This object is " + str(sampleMainObjectList[i].label) + " and the prediction was " + str(resp[1].ravel()[0]))

    procentDog = (float(pravilnoDog) / float(countDog)) * 100
    print("SVM Model")
    print("Procent pravilen dog: " + str(procentDog) + "%")
    print("Stevilo pravilno: " + str(pravilnoDog))
    print("Stevilo testnih: " + str(countDog))
    return None