module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      client: {
        src: 'public/js/main.js',
        dest: 'public/js/bundle.js'
      }
    },
    shell: {
        watchify: {
            command: 'watchify public/js/main.js --debug -o public/js/bundle.js -v'
        }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('watchify', ['shell:watchify']);

};
