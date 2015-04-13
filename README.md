# Web Audio API Editor Extension for Google Chrome

Google Chrome DevTools extension to view and hopefully interact with the routing graph of Web Audio API. Very much based on Firefox DevTools Web Audio Editor.

Twin project of [WebGL GLSL Shader Editor Extension for Google Chrome
](https://github.com/spite/ShaderEditorExtension)

![Web Audio Editor](/about/snapshot-1.jpg)
![Web Audio Editor](/about/snapshot-2.jpg)

Some more info about this project: [WebAudio-Hook demos](http://www.clicktorelease.com/tmp/wa-hook/)

Included in the folder ``wa-hook``is the project with the library that instruments a bit more of the AudioContext, and adds interactivty with a few nodes, through DAT.GUI.

### How to install ###

While in beta, you can load the extension from disk directly:
- Checkout the repo
- Open Chrome's Extensions page (``Settings / More tools / Extensions``)
- Enable ``Developer Mode``
- Click on ``Load unpacked extension``...
- Select the folder /src in the checked out project

Alternatively, you can pack the extension yourself and load by dropping the .crx file in the Extensions page.

### How to use ###

- Browse to a page with Web Audio content (you can find many [here]( http://webaudiodemos.appspot.com/), [here]( https://chromium.googlecode.com/svn/trunk/samples/audio/samples.html) and [here](https://www.chromeexperiments.com/?q=web%20audio))
- Open DevTools
- Select the ``Web Audio`` tab
- The extension needs to instrument ``AudioContext``, so the inspected tab has to be reloaded with the script injected. Hit the ``Reload`` button.
- If there are calls to create nodes and connect them, the UI will show a graph

### TO-DO ###

As always: forks, pull requests and code critiques are welcome!

#### Changelog ####

- v1.0.0 initial release
- v1.0.1 fix extensions not being enabled 
- v1.0.2 added colour highlighting for hover
- v1.0.3 rolled back, colouring introducing bugs
- v1.0.4 fixed some shaders not compiling (issue #4)

#### License ####

MIT licensed

Copyright (C) 2015 Jaume Sanchez Elias, http://www.clicktorelease.com