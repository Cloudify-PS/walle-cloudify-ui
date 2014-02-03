
# Cosmo UI

An [AngularJS][4] based UI for Cosmo.


===


## White Labeling

### Building from source

Assuming you have cloned the repository, make sure you have the following installed:
- [NodeJS][1]
- [bower][2] (which can be installed via node - simply run `npm install -g bower`)

Than navigate to the project root directory and run `npm install` and `bower install`. To launch a preview server run
`grunt server` in the same directory.

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



## I18N

***Note:** Updating I18N configuration requires server restart.*

Translations can be done as follows:
- Create an additional translation file under `/app/i18n`, copy the contents of `translations_en.json` into it.
- Change the property values to include the desired translated strings.
- Save the file to `/app/i18n` and rename it to update the locale suffix (e.g. `translations_zh_CN.json`).
- Update the configuration with the locale string: In your `meConf` file (assuming you have created one - if not, in
  the server root create `/conf/dev/meConf.js`),
  add an entry to override the default language, as follows:

      exports.i18n = {
          language: 'de' // this is your locale string
      };





[1]: http://nodejs.org/
[2]: http://bower.io/
[3]: http://sass-lang.com/
[4]: http://angularjs.org/

