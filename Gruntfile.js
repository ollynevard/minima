module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
      styles: {
        src: 'dist/css/minima.min.css'
      }
    },

    cssmin: {
      styles: {
        files: {
          'dist/css/minima.min.css': ['dist/css/minima.min.css']
        }
      }
    },

    less: {
      styles: {
        files: {
          "dist/css/minima.min.css": "src/less/minima.less"
        }
      }
    },

    watch: {
      styles: {
        files: ['src/less/**/*.less'],
        tasks: ['less', 'autoprefixer', 'cssmin'],
        options: {
          livereload: true
        },
      }
    }
  });

  // Load plugins.
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['less', 'autoprefixer', 'cssmin']);
  grunt.registerTask('dev', ['default', 'watch']);
};
