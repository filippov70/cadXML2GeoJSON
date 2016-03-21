/**
 * New node file
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            main: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'src/cadXML2GeoJSON.js',//'src/cadXML2GeoJSON',
                dest: 'dist/cadXML2GeoJSON.js'
            }
        }
//        ,
//				concat: {
//					options : {
//						separator : ';'
//					},
//					dist : {
//						src : [ 'src/CadXML2GeoJSON.js' ],
//						dest : 'dist/<%= pkg.name %>.js'
//					}
//				},
//        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
//            },
//            dist: {
//                files: {
//                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
//                }
//            }
//        },
//				qunit : {
//					files : [ 'test/**/*.html' ]
//				},
//        jshint: {
//            files: ['gruntfile.js', 'src/**/*.js'],
//            options: {
//                // options here to override JSHint defaults
//                globals: {
//                    console: true,
//                    module: true,
//                    document: true
//                }
//            }
//        },
//        jsdoc: {
//            dist: {
//                src: ['src/**/*.js'],
//                options: {
//                    destination: 'doc'
//                }
//            }
//        }
        ,
        watch: {
            files: ['src/*'],
            tasks: ['default']
        }
    });
    //grunt.loadNpmTasks('grunt-jsdoc');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-browserify');
//    grunt.loadNpmTasks('grunt-contrib-concat');
//	grunt.registerTask('test', [ 'jshint', 'qunit' ]);
//	grunt.registerTask('dev', [ 'jshint', 'concat' ]);
    grunt.registerTask('default', ['browserify']);
//	grunt.registerTask('production', [ 'jshint', /*'qunit',*/ 'concat', 'uglify',
//			'jsdoc' ]);
};