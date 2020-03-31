import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class EnvironmentService {
    /**
     * angular-environment Plugin
     *
     * Rewrite of https://github.com/juanpablob/angular-environment
     */

    environment = 'development'; // default
    data: any = {}; // user defined environments data

    constructor() {
       
        this.data = {
            domains: {
              local: ['grammi.amt.in', 'localhost'],
              beta: ['beta.grammi.io'],
              live: ['team.grammi.io']
            },
            vars: {
              local: {
                apiUrl: 'https://grammi.amt.in/api/v1',
                socketURL:'https://grammi.amt.in/',
                Auth0Domain: 'dev-4i6ucx3x.auth0.com',
                Auth0ClientId: "dw3hC56TSXcxBOuewqDEzw84Fm3PjjFp",
                Auth0audience:"http://user.com",
                S3bucket:"dev-grammi",
                firebase: {
                    apiKey: "AIzaSyDq78JOHNyGzSBKEOz4W_fTa_QJRXladzQ",
                    authDomain: "grmm-e1d7b.firebaseapp.com",
                    databaseURL: "https://grmm-e1d7b.firebaseio.com",
                    projectId: "grmm-e1d7b",
                    storageBucket: "grmm-e1d7b.appspot.com",
                    messagingSenderId: "896688325348",
                    appId: "1:896688325348:web:aff3bc9f41beef694462f1",
                    measurementId: "G-TZQL3F9VX7"
                  }
              },
              beta: {
                apiUrl: 'https://beta.grammi.io/api/v1',
                socketURL:'https://beta.grammi.io/',
                Auth0Domain: 'beta-grammi.auth0.com',
                Auth0ClientId: "6aGzotKrEYayAgnNz2qwyM8Xc8wUgykC",
                Auth0audience:"https://beta.grammi.io",
                S3bucket:"beta-grammi",
                firebase: {
                    apiKey: "AIzaSyDq78JOHNyGzSBKEOz4W_fTa_QJRXladzQ",
                    authDomain: "grmm-e1d7b.firebaseapp.com",
                    databaseURL: "https://grmm-e1d7b.firebaseio.com",
                    projectId: "grmm-e1d7b",
                    storageBucket: "grmm-e1d7b.appspot.com",
                    messagingSenderId: "896688325348",
                    appId: "1:896688325348:web:aff3bc9f41beef694462f1",
                    measurementId: "G-TZQL3F9VX7"
                  }
              },
              live: {
                apiUrl: 'https://team.grammi.io/api/v1',
                socketURL:'https://team.grammi.io/',
                Auth0Domain: 'grammi.auth0.com',   
                Auth0ClientId: "rTNRYMKEbWYfC8cTTZLpkDJeJVLqd44I",
                Auth0audience:"https://grammi.io",
                S3bucket:"live-grammi",
                firebase: {
                    apiKey: "AIzaSyDq78JOHNyGzSBKEOz4W_fTa_QJRXladzQ",
                    authDomain: "grmm-e1d7b.firebaseapp.com",
                    databaseURL: "https://grmm-e1d7b.firebaseio.com",
                    projectId: "grmm-e1d7b",
                    storageBucket: "grmm-e1d7b.appspot.com",
                    messagingSenderId: "896688325348",
                    appId: "1:896688325348:web:aff3bc9f41beef694462f1",
                    measurementId: "G-TZQL3F9VX7"
                  }
              }
            }
          }
        this.check();
    }
    pregQuote(string, delimiter?) {
        return (string + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    };


    stringToRegex(string) {
        return new RegExp(this.pregQuote(string).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'g');
    }
    /**
     * config() allow pass as object the
     * desired environments with their domains
     * and variables
     *
     * @param {Object} config
     * @return {Void}
     */
    config(config) {
        this.data = config;
    };

    /**
     * set() set the desired environment
     * based on the passed string
     *
     * @param {String} environment
     * @return {Void}
     */
    set(environment) {
        this.environment = environment;
    };

    /**
     * get() returns the current environment
     *
     * @return {Void}
     */
    get() {
        return this.environment;
    };

    /**
     * read() returns the desired variable based
     * on passed argument
     *
     * @param {String} variable
     * @return {Void}
     */
    read(variable?) {
        if (typeof variable === 'undefined' || variable === '' || variable === 'all') {
            return this.data.vars[this.get()];
        }
        else if (typeof this.data.vars[this.get()][variable] === 'undefined') {
            return this.data.vars.defaults[variable];
        }

        return this.data.vars[this.get()][variable];
    };

    /**
     * is() checks if the passed environment
     * matches with the current environment
     *
     * @param {String} environment
     * @return {Boolean}
     */
    is(environment) {
        return (environment === this.environment);
    };

    /**
     * check() looks for a match between
     * the actual domain (where the script is running)
     * and any of the domains under env constant in
     * order to set the running environment
     *
     * @return {Void}
     */
    check() {
        const self = this;
        const location = window.location.host;
        let matches = [];
        let keepGoing = true;

        for (let k in this.data.domains) {
            let v = this.data.domains[k];
            v.forEach(v => {
                if (location.match(this.stringToRegex(v))) {
                    matches.push({
                        environment: k,
                        domain: v
                    });
                   
                }
            });
        }

        matches.forEach((v, k) => {
            if (keepGoing) {
                if (location === v.domain) {
                    keepGoing = false;
                }
                self.environment = v.environment;
            }
        });

    };

}
