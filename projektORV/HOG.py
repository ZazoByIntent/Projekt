import skimage.io, skimage.color
import numpy
import matplotlib.pyplot
from numba import jit
#https://towardsdatascience.com/hog-histogram-of-oriented-gradients-67ecd887675f
#https://learnopencv.com/histogram-of-oriented-gradients/

def calculateGradient(image, mask):
    maskSize = mask.size #velikost maske
    
    newImage = numpy.zeros((image.shape[0]+maskSize-1, image.shape[1]+maskSize-1)) #Ustvari nov array velikosti slike + 2 (oz kolikor je maska)
    #padding je zarad računanja pol naprej drgač je out of range
    newImage[numpy.uint16((maskSize-1)/2.0):image.shape[0]+numpy.uint16((maskSize-1)/2.0), numpy.uint16((maskSize-1)/2.0):image.shape[1]+numpy.uint16((maskSize-1)/2.0)] = image #Dodamo padding, torej nule v obrob podatkov slike
    result = numpy.zeros((newImage.shape)) 

    #numpy.intc ker int() dobi error ko hočeš cel array spremenit v int
    for row in numpy.uint16(numpy.arange((maskSize-1)/2.0, image.shape[0]+(maskSize-1)/2.0)): #array z številom od 1 do (velikosti slike, 128 v tem primeru)
        for collumn in numpy.uint16(numpy.arange((maskSize-1)/2.0,image.shape[1]+(maskSize-1)/2.0)): #array z številom od 1 do (velikosti slike, 64 v tem primeru)
            currentRegion = newImage[row-numpy.uint16((maskSize-1)/2.0):row+numpy.uint16((maskSize-1)/2.0)+1,collumn-numpy.uint16((maskSize-1)/2.0):collumn+numpy.uint16((maskSize-1)/2.0)+1] #vzame velikost 4x4 (regija)
            currentResult = currentRegion * mask #poračunaš z maskami [-1,0,1] in pol še z [[-1],[0],[1]]
            score = numpy.sum(currentResult) #sešteje vrednosti v arrayu in shrani v spremenljivko
            result[row, collumn] = score #rezultat seštevanje shranimo na isto mesto v arrayu rezulatov
    #Result of the same size as the original image after removing the padding.
    resultImage = result[numpy.uint16((maskSize-1)/2.0):result.shape[0]-numpy.uint16((maskSize-1)/2.0),numpy.uint16((maskSize-1)/2.0):result.shape[1]-numpy.uint16((maskSize-1)/2.0)]
    return resultImage

def gradientMagnitude(horizontalGradient, verticalGradient):
    horizontalGradientSquare = numpy.power(horizontalGradient, 2)
    verticalGradientSquare = numpy.power(verticalGradient, 2)
    sumSquares = horizontalGradientSquare + verticalGradientSquare
    gradMagnitude = numpy.sqrt(sumSquares)
    return gradMagnitude

def gradientDirection(horizontalGradient, verticalGradient):
    gradDirection = numpy.arctan(verticalGradient/(horizontalGradient+0.00000001)) #Dodam minimalno število 0.00000001, ker ne moreš deliti z 0
    gradDirection = numpy.rad2deg(gradDirection) #formule ki so uporabljene za računanje so v literaturi v linkih
    gradDirection = gradDirection%180
    return gradDirection

def HOGCellHistogram(cellDirection, cellMagnitude, histogramBins):
    HOGCellHistogram = numpy.zeros(shape=(histogramBins.size)) #Velikost 8 v mojem primeru
    cellSize = cellDirection.shape[0] #velikost 8 v mojem primeru

    for rowIndex in range(cellSize):
        for collumnIndex in range(cellSize):
            currentDirection = cellDirection[rowIndex, collumnIndex]
            currentMagnitude = cellMagnitude[rowIndex, collumnIndex]

            difference = numpy.abs(currentDirection - histogramBins)
            
            if currentDirection < histogramBins[0]:
                firstBinIndex = 0
                secondBinIndex = histogramBins.size-1
            elif currentDirection > histogramBins[-1]:
                firstBinIndex = histogramBins.size-1
                secondBinIndex = 0
            else:
                firstBinIndex = numpy.where(difference == min(difference))[0][0]
                temporary1 = histogramBins[[(firstBinIndex-1)%histogramBins.size, (firstBinIndex+1)%histogramBins.size]]
                temporary2 = abs(currentDirection - temporary1)
                res = numpy.where(temporary2 == min(temporary2))[0][0]
                if res == 0 and firstBinIndex != 0:
                    secondBinIndex = firstBinIndex-1
                else:
                    secondBinIndex = firstBinIndex+1
            
            firstBinValue = histogramBins[firstBinIndex]
            secondBinValue = histogramBins[secondBinIndex]
            HOGCellHistogram[firstBinIndex] = HOGCellHistogram[firstBinIndex] + (abs(currentDirection - firstBinValue)/(180.0/histogramBins.size)) * currentMagnitude
            HOGCellHistogram[secondBinIndex] = HOGCellHistogram[secondBinIndex] + (abs(currentDirection - secondBinValue)/(180.0/histogramBins.size)) * currentMagnitude
    return HOGCellHistogram

