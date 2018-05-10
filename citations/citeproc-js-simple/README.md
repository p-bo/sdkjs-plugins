# citeproc-simple

## Description

This module provides a basic wrapper for deploying citeproc-js
in node and iojs projects. The processor instance delivered
by the `Citeproc` method supports very basic functionality of
the processor:

* Generating a bibliography listing in a chosen style and locale

Advanced `citeproc-js` features *not* supported include:

* Persistence and reuse of the instantiated processor object
* Dynamic citation editing (with inline citations or footnotes)
* Multilingual bibliography entries
* Jurisdiction-dependent legal citations
* Automated abbreviation of citation elements
* HTML citation links

This project is updated with each tagged release of [citeproc-js](https://github.com/juris-m/citeproc-js).

## Setup (from source)

To run from a checkout of the source repository, run the following incantations:

    git clone --recursive https://github.com/Juris-M/citeproc-node-iojs.git
    cd citeproc-node-iojs
    npm install
    npm run test

The test should pass.


## Setup (from `npm`)

(note that the code in this repository is not yet reflected in `npm`)

To install via `npm`, use the usual incantation:

    npm install citeproc-node-iojs

To add the wrapped processor to a project, use `require` in the usual way:

    var csl = require('citeproc-node-iojs')

## Further information

* The test fixture in the file `test/test.js` shows how the wrapper can
  be invoked to produce a bibliography. Citation data used by the test
  is in the file `test/citations.json`.
* For information on the CSL style language, see the [CSL project
  website](http://citationstyles.org).
* For documentation on the
  processor, see the [Citeproc-js Manual](http://citeproc-js.readthedocs.io/en/latest).
* For an example of browser-side dynamic editing of citations, see the [Academic
  Blogger's Toolkit](https://github.com/dsifford/academic-bloggers-toolkit), a 
  WordPress plugin by Derek Sifford.
