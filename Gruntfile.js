module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      html: {
        options: {
          livereload: true,
        },
        files: ['**/*.html']
      },
      jade: {
        options: {
          livereload: true,
        },
        files: ['**/*.jade'],
        tasks: ['build:dev']
      }
    },

    jade: {
      options: {
        pretty: true
      },
      build: {
        files: [{
          expand: true,
          cwd: '',
          src: ['*.jade', '!*template.jade'],
          dest: '',
          ext: '.html'
        }]
      }
    }

  });
  
  grunt.registerTask('build:dev', [
    'jade'
  ]);
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-newer');
  grunt.registerTask('default', ['build:dev']);

};

