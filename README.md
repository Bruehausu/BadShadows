
This is a small web-based drawing app that comes with a phony AI meant to simulate an unhelpful AI. as you draw, it adds seemingly random lines to your sketch in an attempt to help you complete your drawing.

this sketch requires some data pricessing begor it can be run:

1) this program uses Methias Eitz's dataset of drawings (http://cybertron.cg.tu-berlin.de/eitz/projects/classifysketch/). Download the svg dataset

2) Put the svg set in the data folder of svgAnalyzer (this processing sketch runs in 2.2.1), and run the sktech

3) You should not have a new "out.csv" that contains information about every inividual contour in Eitz's dataset. rename it to "paths.csv", and put in in the assets folder in the drawingProgram folder.

4) You can now run drawingProgram off a server!