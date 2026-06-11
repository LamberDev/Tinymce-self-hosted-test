import angular from 'angular';

// Register modules/components before bootstrapping.
import './tiny-editor/tiny-editor.module.js';
import './tiny-editor/tiny-editor.component.js';
import './app.js';

// Manual bootstrap (instead of ng-app) so it runs after the bundled modules
// are registered and after the self-hosted TinyMCE script has loaded.
angular.element(function () {
  angular.bootstrap(document.getElementById('app-root'), ['app']);
});
