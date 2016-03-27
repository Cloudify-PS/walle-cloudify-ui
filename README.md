
# Cosmo UI

An [AngularJS][4] based UI for Cosmo.

* Master [![Circle CI](https://circleci.com/gh/cloudify-cosmo/cloudify-ui/tree/master.svg?style=shield)](https://circleci.com/gh/cloudify-cosmo/cloudify-ui/tree/master)

===


## Setting up your development environment 

 - install nodejs 4.2.0 with npm 
 - run `sudo npm install -g bower grunt-cli`
 - run `sudo npm cache clean && sudo bower cache clean` - this steps is necessary as your cache folders will require root permissions and this will fail the next step
 - run `npm install && bower install` in project root
 - bootstrap a manager - simplest way is to use a vagrantbox. 
 - optional: override configuration
   - create a file `conf/dev/meConf.js` or `conf/dev/meConf.json` (the below example uses json)
   - configure the manager's location. for example:
   ```json
   {
       "cloudifyManagerEndpoint" : "https://10.10.1.10/api/v2/"
   }
   ```
 - run `node server.js` - with intellij you will need the nodejs plugin and then right click on `server.js` and run it.  
 - run `grunt server` - this should open the browser and you can start working



## How to contribute - Workflow

 - ...
 - commit message standard see : https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format



## White Labeling

### Building from source

Assuming you have cloned the repository, make sure you have the following installed:
- [NodeJS][1]
- [bower][2] (which can be installed via node - simply run `npm install -g bower`)

Then navigate to the project root directory and run `npm install` and `bower install`. 
In the directory `conf/dev` create a file `meConf.js` containing the following code:
```javascript
var exports = module.exports = {  
    cosmoServer: '10.10.1.10',  
    cloudifyManagerEndpoint: 'http://10.10.1.10',
    port: '80'
}  
```
To launch a preview server run `grunt server` in the same directory. Launch `node server` in the root directory to connect frontend to cloudify.
To build the app and run all the tests, simply run `grunt` in your terminal.

The app is bundled with a file named `_whitelabel.scss`, which can be found under `/app/styles`. This file contains
[Sass][3] variables for overriding colors and images across the application.

#### Colors

Simply comment out the variables and change the values to override specific variables, or all of them.

#### Images

To change images, several options are available:
- Replace images under `/app/images` with updated files with the same dimensional properties and naming.
- Create another folder under `/app` to host the updated images (still with the same names and dimensions), and refer
to it by overriding the value of the `$images-path` variable to point to its location. That way you can keep the
original images.
- Create new files using any name (dimensions still has to be the same), and override each image specifically. This can
be done by overriding the designated image's variable, e.g. `$img-cloudify-logo: '/my-images-dir/my-image.png'`,
`$img-cloudify-logo: '/images/my-image.svg'`.


### Working with the distribution

Open the distribution and navigate to `/styles`. Open `[revision-prefix]main.css` for editing (e.g. `389640c5.main.css`).

Search / replace repeating color values and / or image paths to override them. Make sure you replace all repeating
occurrences.

When replacing images, the dimensions of new image files has to be the same as the old images'. You can either replace
existing images, or create a new directory and refer to it from the stylesheet.





[1]: http://nodejs.org/
[2]: http://bower.io/
[3]: http://sass-lang.com/
[4]: http://angularjs.org/

