module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      createdb: {
        command: [
        "mysql -u root  -e 'create database shwopDB;'",
        "echo Lets go shwoping!"
        ].join('&&')
      },
      truncateDB: {
        command: [
        "mysql -u root  -e 'use database shwopDB;'",
        "'truncate table Users;'",
        "mysql -u root  -e 'truncate table Products;'",
        "mysql -u root  -e 'truncate table Tags;'",
        "echo Shwoping cart cleared!"
        ].join('&&')
      },
      dropDB: {
        command: [
        "mysql -u root  -e 'use database shwopDB;'",
        "mysql -u root  -e 'drop table Users;'",
        "mysql -u root  -e 'drop table Products;'",
        "mysql -u root  -e 'drop table Tags;'",
        "echo You dropped all your shwopping bags!"
        ].join('&&')
      }
    },

    // mochaTest: {
    //   test: {
    //     options: {
    //       reporter: 'spec'
    //     },
    //     src: ['test/**/*.js']
    //   }
    // },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    database: {
      shell: {
        options: {
          stdout: true,
          stderr: true
        },

      }
    },

    // uglify: {
    // },

    // jshint: {
    //   files: [
    //     // Add filespec list here
    //   ],
    //   options: {
    //     force: 'true',
    //     jshintrc: '.jshintrc',
    //     ignores: [
    //       'public/lib/**/*.js',
    //       'public/dist/**/*.js'
    //     ]
    //   }
    // },

    // cssmin: {
    //     // Add filespec list here
    // },

    // watch: {
    //   scripts: {
    //     files: [
    //       'public/client/**/*.js',
    //       'public/lib/**/*.js',
    //     ],
    //     tasks: [
    //       'concat',
    //       'uglify'
    //     ]
    //   },
    //   css: {
    //     files: 'public/*.css',
    //     tasks: ['cssmin']
    //   }
    // },

    // shell: {
    //   prodServer: {
    //   }
    // },

  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  // grunt.registerTask('server-dev', function (target) {
  //   // Running nodejs in a different process and displaying output on the main console
  //   var nodemon = grunt.util.spawn({
  //        cmd: 'grunt',
  //        grunt: true,
  //        args: 'nodemon'
  //   });
  //   nodemon.stdout.pipe(process.stdout);
  //   nodemon.stderr.pipe(process.stderr);

  //   grunt.task.run([ 'watch' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('create', function(n) {
    grunt.task.run(['shell:createdb']);
  });

  grunt.registerTask('truncate', function(n) {
    grunt.task.run(['shell:truncateDB']);
  });

  grunt.registerTask('drop', function(n) {
    grunt.task.run(['shell:dropDB']);
  });

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('default', function(n) {
    grunt.task.run(['nodemon']);
  });

  grunt.registerTask('start', function(n) {
    grunt.task.run(['nodemon']);
  });

  grunt.registerTask('deploy', [
      // add your production server task here
  ]);


};