module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      html: {
        options: {
          livereload: true,
        },
        files: ['src/*.html']
      },
      jade: {
        options: {
          livereload: true,
        },
        files: ['src/*.jade'],
        tasks: ['build:dev:html']
      },
      css: {
        options: {
          livereload: true,
        },
        files: ['src/*.scss'],
        tasks: ['build:dev:css']
      },
      js: {
        options: {
          livereload: true,
        },
        files: ['src/*.js'],
        tasks: ['build:dev:js']
      },
    },

    jade: {
      options: {
        pretty: true
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.jade'],
          dest: '',
          ext: '.html'
        }]
      }
    },
    
    sass: {
      options: {
        includePaths: [ 'bower_components/' ],
        outputStyle: 'expanded',
        sourceMap: true,
        outFile: ''
      },
      build: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },
    
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: [
            'last 2 versions'
          ]}),
          require('postcss-focus'),
          require("postcss-reporter")({ clearMessages: true })
        ],
        map: true
      },
      build: {
        src: 'css/foodielist.css'
      }
    },
    
    concat: {
      options: {
        sourceMap: false
      },
      build: {
        files: {
          'js/foodielist.js': [
          'bower_components/jquery/dist/jquery.js',
          'src/foodielist.js'
          ]
        }
      }
    },
    
    jshint: {
      build: [
        'Gruntfile.js',
        'src/**/*.js'
      ]
    }
  });
  
  grunt.registerTask('build:dev:html', [
    'jade'
  ]);
  grunt.registerTask('build:dev:css', [
    'sass',
    'postcss'
  ]);
  grunt.registerTask('build:dev:js', [
    'concat',
    'jshint'
  ]);
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-newer');
  grunt.registerTask('default', ['build:dev']);

};