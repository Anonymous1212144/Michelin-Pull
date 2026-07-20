# Michelin-Pull
The main purpose of this is to generate something that can be downloaded/printed because they won't do it.

# Instruction
The main version is `pull-hilbert.js` which list the restaurants in a way that ones that are close together physically will also be close in the list. This will also output a csv to the console which can be imported into Google My Maps or a few other GIS software for generating a labelled map. To use, open the console when on the Michelin Guide website, copy-paste the js code into it, and press enter. Some things you may want/need to change:
- Line 1 is the centre of the location to search, in [latitude, longtitude]
- Line 2 is the radius from the centre to search, in metres
- Line 19 and line 41 determines the language of what you pull. (E.g. change the last 2 letters "en" to "fr" for French)
- Line 59 determines the maximum number to get. By default it is everything

Note that if I listed 2 lines for something, you need to change both otherwise it may behave unpredictably.
