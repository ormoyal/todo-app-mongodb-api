

module.exports = function(grunt) { // npm install --save-dev load-grunt-tasks
 
grunt.initConfig({
    eslint: {
        options: {
            configFile: './eslint.json',
            rulePaths: ['./eslint.json']
        },
        target: ['file.js']
    }
});
 
grunt.registerTask('default', ['eslint']);
};