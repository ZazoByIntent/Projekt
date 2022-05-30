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
import sys
import json

class imageObject:
    normalizedHist = []
    lbpList = []
    label = 0 #1 za sliko uporabnika, 0 za za ostalo

procentTestna = 0
procentUcna = 0
algoritmiCount = 0
algoritmiCount2 = 0
ucnaMnozicaObjektov = []
testnaMnozicaObjektov = []

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

    
    algoritmiCount += 1
    #vrni fixedNormalizedHOGHists
    return fixedNormalizedHOGHists

def pripraviTestnePodatkePoslano(path):
    tempImageObject = imageObject()

    tempImageObject.normalizedHist = hogIzvedi(path)
    tempImageObject.lbpList = lbgIzvedi(path)
    tempImageObject.label = 1

    testnaMnozicaObjektov.append(tempImageObject)

def lbgIzvedi(dir):
    global algoritmiCount2
    img = resize(color.rgb2gray(io.imread(dir)), (128, 64))

    newImage = lbg.getLBPimage(img)

    newImageFixed = []

    for i in range(0, len(newImage), 1):
        for z in range(0, len(newImage[0])):
            newImageFixed.append(newImage[i][z])
    
    algoritmiCount2 += 1

    return newImageFixed

photo = str(sys.argv[1])

pripraviTestnePodatkePoslano(photo)

svmModel.checkSVM(testnaMnozicaObjektov)