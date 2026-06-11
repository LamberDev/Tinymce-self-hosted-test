import angular from 'angular';

// Standalone AngularJS module so the editor can be imported into any app:
//   angular.module('myApp', [TINY_EDITOR_MODULE])
export const TINY_EDITOR_MODULE = 'tinyEditor';

angular.module(TINY_EDITOR_MODULE, []);
