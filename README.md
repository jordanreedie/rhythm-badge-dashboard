Rhythm Dashboard is an open-source dashboard for visualizing processed Rhythm Badge meeting data. Built on top of [RDash-AngularJS](https://github.com/rdash/rdash-angular)

## Usage
### Requirements
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Installation

#### DEV
1. Install the NodeJS dependencies: `npm install`.
2. Install the Bower dependencies: `bower install`.
3. Run the gulp build task: `gulp build`.
4. Run the gulp default task: `gulp`. This will build any changes made automatically, and also run a live reload server on [http://localhost:8888](http://localhost:8888).

#### PROD

1. Set config variables in src/js/config/app.config.js to the appropriate values
2. Set the docker machine you wish to use (e.g. in fish `eval (docker-machine env <machine-name>)`
2. `docker build -t dash .'
3. `docker run -p 80:80 -d --name <container_name> dash`

### Development
Continue developing the dashboard further by editing the `src` directory. With the `gulp` command, any file changes made will automatically be compiled into the specific location within the `dist` directory.

