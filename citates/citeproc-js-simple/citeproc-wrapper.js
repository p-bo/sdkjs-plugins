function Citeproc (preferredLocale, citations, style, mylocales, done) {
   
    var citeproc,
    sys,
    locales = {},
    localeIDs = [];
    localeIDs.push('en-US');
    localeIDs.push(preferredLocale);
    locales[localeIDs[0]] = mylocales;
    locales[localeIDs[1]] = mylocales;
    
    // Constructs the wrapper
    this.construct = function () {
        var self = this;
        self.setupSys();
        citeproc = new CSL.Engine(sys, style, preferredLocale, preferredLocale);
        done(citeproc);
    };

    // Rigs up the sys object for the internal citeproc
    this.setupSys = function () {
        sys = {
            retrieveLocale: function (language) {
                return locales[language];
            },
            retrieveItem: function (id) {
                return citations[id];
             }
        };
    };

    this.construct();
}