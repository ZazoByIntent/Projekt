import numpy
from numba import jit
import math
import os, shutil, random
import skimage.io, skimage.color
from skimage.feature import hog
import HOG
from skimage.transform import resize
from skimage import color
from skimage import io
import svmModel
import knnModel
import lbg

class imageObject:
    normalizedHist = []
    lbpList = []
    label = 0 #1 za psa, 0 za mačko

procentTestna = 0
procentUcna = 0
algoritmiCount = 0
algoritmiCount2 = 0
ucnaMnozicaObjektov = []
testnaMnozicaObjektov = []

def razdeli():
    current_directory = os.getcwd()
    final_directory = os.path.join(current_directory, r'testnaMnozica')
    if os.path.exists(final_directory):
        shutil.rmtree(final_directory)
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'testnaMnozica\\cat')
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'testnaMnozica\\dog')
        os.makedirs(final_directory)
    else:
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'testnaMnozica\\cat')
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'testnaMnozica\\dog')
        os.makedirs(final_directory)
        
    final_directory = os.path.join(current_directory, r'ucnaMnozica')
    if os.path.exists(final_directory):
        shutil.rmtree(final_directory)
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'ucnaMnozica\\cat')
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'ucnaMnozica\\dog')
        os.makedirs(final_directory)
    else:
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'ucnaMnozica\\cat')
        os.makedirs(final_directory)
        final_directory = os.path.join(current_directory, r'ucnaMnozica\\dog')
        os.makedirs(final_directory)
    
    countCat = 0
    dir = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\dataset\\cat'
    for path in os.listdir(dir):
        if os.path.isfile(os.path.join(dir, path)):
            countCat += 1

    countDog = 0
    dir = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\dataset\\dog'
    for path in os.listdir(dir):
        if os.path.isfile(os.path.join(dir, path)):
            countDog += 1

    countCatUcna = 0
    countDogUcna = 0
    countCatTestna = 0
    countDogTestna = 0

    countCatUcna = int(countCat * (procentUcna / 100))
    countDogUcna = int(countDog * (procentUcna / 100))

    countCatTestna = countCat - countCatUcna
    countDogTestna = countDog - countDogUcna

    pictureList = list(range(countCat))
    sourceCat = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\dataset\\cat\\'
    dst = os.path.join(current_directory, r'ucnaMnozica\\cat')

    while(True):
        if(countCatUcna == 0):
            break
        if(len(pictureList) == 0):
            break
        index = random.randint(0, (len(pictureList) - 1))
        sourceCatPicture = sourceCat + str(pictureList[index]) + ".jpg"
        pictureList.remove(pictureList[index])
        countCatUcna = countCatUcna - 1
        shutil.copy(sourceCatPicture, dst)

    print("Cat učna napolnjena")
    dst = os.path.join(current_directory, r'testnaMnozica\\cat')

    while(True):
        if(countCatTestna == 0):
            break
        if(len(pictureList) == 0):
            break
        index = random.randint(0, (len(pictureList) - 1))
        sourceCatPicture = sourceCat + str(pictureList[index]) + ".jpg"
        pictureList.remove(pictureList[index])
        countCatTestna = countCatTestna - 1
        shutil.copy(sourceCatPicture, dst)

    print("Cat testna napolnjena")
    pictureList = list(range(countCat))
    sourceDog = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\dataset\\dog\\'
    dst = os.path.join(current_directory, r'ucnaMnozica\\dog')

    while(True):
        if(countDogUcna == 0):
            break
        if(len(pictureList) == 0):
            break
        index = random.randint(0, (len(pictureList) - 1))
        sourceDogPicture = sourceDog + str(pictureList[index]) + ".jpg"
        pictureList.remove(pictureList[index])
        countDogUcna = countDogUcna - 1
        shutil.copy(sourceDogPicture, dst)

    print("Dog učna napolnjena")
    dst = os.path.join(current_directory, r'testnaMnozica\\dog')

    while(True):
        if(countDogTestna == 0):
            break
        if(len(pictureList) == 0):
            break
        index = random.randint(0, (len(pictureList) - 1))
        sourceDogPicture = sourceDog + str(pictureList[index]) + ".jpg"
        pictureList.remove(pictureList[index])
        countDogTestna = countDogTestna - 1
        shutil.copy(sourceDogPicture, dst)
    print("Dog testna napolnjena")


    '''
    src = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\dataset\\cat\\0.jpg'
    dst = os.path.join(current_directory, r'testnaMnozica\\cat')
    shutil.copy(src, dst)
    '''
    return None

def hogIzvedi(dir):
    global algoritmiCount
    img = resize(color.rgb2gray(io.imread(dir)), (128, 64))

    horizontalMask = numpy.array([-1, 0, 1])
    verticalMask = numpy.array([[-1],[0],[1]])

    horizontalGradient = HOG.calculateGradient(img, horizontalMask)
    verticalGradient = HOG.calculateGradient(img, verticalMask)

    gradMagnitude = HOG.gradientMagnitude(horizontalGradient, verticalGradient)
    gradDirection = HOG.gradientDirection(horizontalGradient, verticalGradient)

    histogramBins = numpy.array([0,20,40,60,80,100,120,140,160])

    cellHOGHists = []

    for height in range(0, 128, 8):
        cellHOGHistsTemp = []
        for width in range(0, 64, 8):
            tempWidth = width + 8
            tempHeight = height + 8

            cell_direction = gradDirection[height:tempHeight, width:tempWidth]
            cell_magnitude = gradMagnitude[height:tempHeight, width:tempWidth]
            HOG_cell_hist = HOG.HOGCellHistogram(cell_direction, cell_magnitude, histogramBins)
            cellHOGHistsTemp.append(HOG_cell_hist)
        cellHOGHists.append(numpy.array(cellHOGHistsTemp))

    normalizedHOGHists = []

    for indexY in range(0,15,1):
        tempCellHOGHist2 = []
        for indexX in range(0,7,1):
            tempCellHOGHist = []
            tempCellHOGHist = numpy.append(tempCellHOGHist,cellHOGHists[indexY][indexX])
            tempCellHOGHist = numpy.append(tempCellHOGHist,cellHOGHists[indexY][indexX + 1])
            tempCellHOGHist = numpy.append(tempCellHOGHist,cellHOGHists[indexY + 1][indexX])
            tempCellHOGHist = numpy.append(tempCellHOGHist,cellHOGHists[indexY + 1][indexX + 1])
            tempDelitelj = 0
            tempCellHOGHist = numpy.power(tempCellHOGHist,2)
            for i in range(0,36,1):
                tempDelitelj = tempDelitelj + tempCellHOGHist[i]
            tempDelitelj = math.sqrt(tempDelitelj)
            for i in range(0,36,1):
                tempCellHOGHist[i] = tempCellHOGHist[i] / tempDelitelj
            tempCellHOGHist2.append(tempCellHOGHist)
    
        normalizedHOGHists.append(tempCellHOGHist2)

    fixedNormalizedHOGHists = []

    for z in range(0, len(normalizedHOGHists),1):
        for i in range(0, len(normalizedHOGHists[0]),1):
            for x in range(0, len(normalizedHOGHists[0][0]),1):
                fixedNormalizedHOGHists.append(normalizedHOGHists[z][i][x])  

    fixedNormalizedHOGHists = hog(img) #ignoriri tole morm še pogledat kje se mi matka zajebe v hog.py
    algoritmiCount += 1
    print("Obdelano HOG: " + str(algoritmiCount))
    #vrni fixedNormalizedHOGHists
    return fixedNormalizedHOGHists

def lbgIzvedi(dir):
    global algoritmiCount2
    img = resize(color.rgb2gray(io.imread(dir)), (128, 64))

    newImage = lbg.getLBPimage(img)

    newImageFixed = []

    for i in range(0, len(newImage), 1):
        for z in range(0, len(newImage[0])):
            newImageFixed.append(newImage[i][z])
    
    algoritmiCount2 += 1
    print("Obdelano LBG: " + str(algoritmiCount2))

    return newImageFixed

while(True):
    print("1. Razdeli slike v učno in testno množico (npr. razdeli 80/20)")
    print("2. HOG in LBG (algoritmi)")
    print("3. Check (check)")
    print("3. Testno ucenje\n")
    inputUser = input("Write something: ")
    inputUser = inputUser.split()
    if("razdeli" in inputUser):
        inputUser = inputUser[1]
        inputUser = inputUser.split("/")
        procentUcna = int(inputUser[0])
        procentTestna = int(inputUser[1])
        razdeli()
    elif("algoritmi" in inputUser):
        algoritmiCount = 0
        algoritmiCount2 = 0
        dir = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\ucnaMnozica\\cat'
        for path in os.listdir(dir):
            tempImageObject = imageObject()
            if os.path.isfile(os.path.join(dir, path)):
                test = os.path.join(dir, path)
                try:
                    tempImageObject.normalizedHist = hogIzvedi(test)
                    tempImageObject.label = 0
                    tempImageObject.lbpList = lbgIzvedi(test)
                    ucnaMnozicaObjektov.append(tempImageObject)
                except:
                    print("Preskočena koruptirana slika")

        dir = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\ucnaMnozica\\dog'
        for path in os.listdir(dir):
            tempImageObject = imageObject()
            if os.path.isfile(os.path.join(dir, path)):
                test = os.path.join(dir, path)
                try:
                    tempImageObject.normalizedHist = hogIzvedi(test)
                    tempImageObject.label = 1
                    tempImageObject.lbpList = lbgIzvedi(test)
                    ucnaMnozicaObjektov.append(tempImageObject)
                except:
                    print("Preskočena koruptirana slika")
        print("Final Obdelano: " + str(algoritmiCount))
        svmModel.trainSVM(ucnaMnozicaObjektov)
        knnModel.trainKNN(ucnaMnozicaObjektov)
    elif("check" in inputUser):
        algoritmiCount = 0
        algoritmiCount2 = 0
        dir = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\testnaMnozica\\cat'
        for path in os.listdir(dir):
            tempImageObject = imageObject()
            if os.path.isfile(os.path.join(dir, path)):
                test = os.path.join(dir, path)
                try:
                    tempImageObject.normalizedHist = hogIzvedi(test)
                    tempImageObject.label = 0
                    tempImageObject.lbpList = lbgIzvedi(test)
                    testnaMnozicaObjektov.append(tempImageObject)
                except:
                    print("Preskočena koruptirana slika")
        dir = 'C:\\Users\\Luka\\Desktop\\FERI 2-letnik\\Vaje\\2. semester\\Osnove racunalniskega vida\\Znacilnice\\testnaMnozica\\dog'
        for path in os.listdir(dir):
            tempImageObject = imageObject()
            if os.path.isfile(os.path.join(dir, path)):
                test = os.path.join(dir, path)
                try:
                    tempImageObject.normalizedHist = hogIzvedi(test)
                    tempImageObject.label = 1
                    tempImageObject.lbpList = lbgIzvedi(test)
                    testnaMnozicaObjektov.append(tempImageObject)
                except:
                    print("Preskočena koruptirana slika")
        svmModel.checkSVM(testnaMnozicaObjektov)
        knnModel.checkKNN(testnaMnozicaObjektov)
    else:
        print(inputUser)