module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
      dist: {
        src: 'dist/css/minima.min.css'
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/css/minima.min.css': ['dist/css/minima.min.css']
        }
      }
    },

    less: {
      dist: {
        files: {
          "dist/css/minima.min.css": "src/less/minima.less"
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/minima.smoothscroll.min.js': ['src/js/minima.smoothscroll.js'],
          'dist/js/minima.offcanvas.min.js': ['src/js/minima.offcanvas.js'],
          'dist/js/minima.alertbox.min.js': ['src/js/minima.alertbox.js']
        }
      }
    },

    watch: {
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less', 'autoprefixer', 'cssmin'],
        options: {
          livereload: true
        },
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify'],
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['less', 'autoprefixer', 'cssmin', 'uglify']);
  grunt.registerTask('dev', ['default', 'watch']);
};
