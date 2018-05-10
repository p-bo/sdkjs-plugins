var assert    = require('assert');
var expect = require('chai').expect;
var citations = require('./citations.json');
var Citeproc  = require('../citeproc-wrapper.js');

describe('citeproc-js', function () {

    var result = '  <div class="csl-entry"><i>Digital Typography</i>. Center for the Study of Language and Information, 1998.</div>\n  <div class="csl-entry">Friedl, Jeffrey E. F. <i>Mastering Regular Expressions</i>. 3. utg. O’Reilly Media, 2006.</div>\n  <div class="csl-entry">Jarvis, Robert M. «John B. West: Founder of the West Publishing Company». <i>American Journal of Legal History</i> 50, nr. 1 (1. januar 2008): 1–22. doi:10.2307/25664481.</div>\n  <div class="csl-entry">Sprowl, James A. «The Westlaw System: A Different Approach to Computer-Assisted Legal Research». <i>Jurimetrics Journal</i> 16 (1976 1975): 142. http://heinonline.org/HOL/Page?handle=hein.journals/juraba16&#38;id=152&#38;div=&#38;collection=journals.</div>\n'
    
    it('should parse a JSON object to a correct bibliography', function (done) {
        this.timeout(3000);

        var styleDir = 'styles'
        var style  = 'chicago-fullnote-bibliography.csl';
        var preferredLocale = 'nb';

        var cite = new Citeproc(preferredLocale, styleDir, style, citations, function (citeproc) {
            citeproc.updateItems(Object.keys(citations));
            var bibliography = citeproc.makeBibliography();
            expect(bibliography, "Bad object returned from makeBibliography()").to.have.length(2);
            expect(bibliography[1].join('')).to.equal(result);
            done();
        });
    });
});
