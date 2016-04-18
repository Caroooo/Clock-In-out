module.exports = function(grunt) {
    "use strict";
    var path = require("path");
    var wsSettings = grunt.file.readJSON(path.join(process.cwd(), "/webApp/ws/ws-settings.json"));

    var proxyUtils = require(path.join(process.cwd(), "node_modules/grunt-connect-proxy/lib/utils")).proxyRequest;

    grunt.initConfig({

        dir: {
            webapp: "webapp",
            dist: "dist",
            bower_components: "bower_components"
        },

        connect: {
            options: {
                port: 8080,
                hostname: "localhost",
                livereload: 35729,
                middleware: function(connect, options, middlewares) {
                    middlewares.unshift(proxyUtils);
                    return middlewares;
                }
            },
            proxies: [
                {
                    context: "/webservices", // When the url contains this...
                    host: wsSettings.modes.intern.host, // Proxy to this host
                    headers: {
                        "host": wsSettings.modes.intern.host
                    },

                    rewrite: {
                        '^/webservices': ''
                    }
                },
                {
                    context: "/webservices_ext", // When the url contains this...
                    host: wsSettings.modes.extern.host, // Proxy to this host
                    port: 443,
                    https: true,
                    headers: {
                        "host": wsSettings.modes.extern.host
                    },

                    rewrite: {
                        '^/webservices_ext': ''
                    }
                }
            ],

            src: {},
            dist: {}
        },

        openui5_connect: {
            options: {
                resources: [
                    "<%= dir.bower_components %>/openui5-sap.m/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.core/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.commons/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.layout/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.unified/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.table/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.suite/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.ux3/resources",
                    "<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources",
                    "<%= dir.bower_components %>/openui5-themelib_sap_goldreflection/resources"
                ]
            },
            src: {
                options: {
                    appresources: "<%= dir.webapp %>"
                }
            },
            dist: {
                options: {
                    appresources: "<%= dir.dist %>"
                }
            }
        },

        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: "<%= dir.webapp %>",
                        prefix: "todo"
                    },
                    dest: "<%= dir.dist %>"
                },
                components: true
            }
        },

        clean: {
            dist: "<%= dir.dist %>/"
        },

        copy: {
            dist: {
                files: [ {
                    expand: true,
                    cwd: "<%= dir.webapp %>",
                    src: [
                        "**",
                        "!test/**"
                    ],
                    dest: "<%= dir.dist %>"
                } ]
            }
        },

        eslint: {
            webapp: ["<%= dir.webapp %>"]
        },

        open: {
            root: {
                path: "http://<%= connect.options.hostname %>:<%= connect.options.port %>",
                options: {
                    delay: 500
                }
            }
        },

        watch: {
            webapp: {
                files: "<%= dir.webapp %>/**",
                tasks: ["eslint"]
            },
            livereload: {
                options: {
                    livereload: "<%= connect.options.livereload %>"
                },
                files: [
                    "<%= dir.webapp %>/**"
                ]
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-connect-proxy");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-open");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Server task
    grunt.registerTask("serve", function(target) {
        //grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
        grunt.task.run("openui5_connect:" + (target || "src:livereload"));
    });

    // Linting task
    grunt.registerTask("lint", ["eslint"]);

    // Build task
    grunt.registerTask("build", ["openui5_preload", "copy"]);


    // Develop task which configures proxy to use external addresses
    grunt.registerTask("develop", [
        "configureProxies",
        "serve",
        "open",
        "watch"
    ]);

    // Default task
    grunt.registerTask("default", [
        "lint",
        "clean",
        "build",
        "configureProxies",
        "serve:dist",
        "open",
        "watch"
    ]);

};