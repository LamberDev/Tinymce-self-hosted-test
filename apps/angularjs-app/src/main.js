import angular from 'angular';

import './tiny-editor/tiny-editor.module.js';
import './tiny-editor/tiny-editor.component.js';
import './app.js';

angular.element(function () {
  angular.bootstrap(document.getElementById('app-root'), ['app']);
});
