var Cli = require("matrix-appservice-bridge").Cli;
var AppServiceRegistration = require("matrix-appservice-bridge").AppServiceRegistration;

var Main = require("./lib/Main");
const ConfigureLogging = require("./lib/Logging.js").Configure;
const log = require("./lib/Logging.js").Get("index.js");

new Cli({
    registrationPath: "gitter-registration.yaml",
    bridgeConfig: {
        schema: "config/gitter-config-schema.yaml",
    },
    generateRegistration: function(reg, callback) {
        reg.setHomeserverToken(AppServiceRegistration.generateToken());
        reg.setAppServiceToken(AppServiceRegistration.generateToken());
        reg.setSenderLocalpart("gitterbot");
        reg.addRegexPattern("users", "@gitter_.*", true);
        reg.addRegexPattern("aliases", "#gitter_.*", true);
        reg.setId("gitter");
        callback(reg);
    },
    run: function(port, config) {
        log.info("Matrix-side listening on port %s", port);
        if (config.logging) {
            ConfigureLogging(config.logging);
        }
        (new Main(config)).run(port);
    },
}).run();
