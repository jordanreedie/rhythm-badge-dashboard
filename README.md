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

1. Copy 'env_template' to '.env'
2. Set config variables in .env to the appropriate values
3. Set the docker machine you wish to use (e.g. in fish `eval (docker-machine env <machine-name>)`)
4. Run the 'apply_env.sh' script
5. `docker build -t dash .`
6. `docker run -p 80:80 -d --name <container_name> dash`
