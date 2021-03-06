
/**
 * The search-bar directive can be placed on any page or in the navbar, and searches songs for similar titles.
 * Controller: Typeahead Controller
 * Templates: [directive definition, typeahead-template.html]
 * @module angular ui-bootstrap
 */
app.directive( 'searchBar', function ( $rootScope, AuthService, AUTH_EVENTS, $state ) {
  return {
    controller: 'TypeaheadCtrl',
    template: searchBarTemplate
  };
} );

app.controller( 'TypeaheadCtrl', function ( $scope, $http, $state, $rootScope ) {

  var _selected;

/**
 * [getSongs sends a query to the search route]
 * @param  {String} searchQuery [title string to search]
 * @return {Object[]}             [an array of song objects]
 */
  $scope.getSongs = function ( searchQuery ) {
    let config = {
      params: {
        where: {
          title: {
            like: '%' + searchQuery + '%'
          }
        }
      }
    };
    return searchQuery ? $http.get( '/api/v1/songs/s', config )
      .then( response => response.data ) : new Promise(resolve => resolve([]));
  };

  $scope.updateSongs = function ( customSelected ) {
    $scope.getSongs( customSelected )
      .then( songs => $scope.songs = songs );
  };

  $scope.ngModelOptionsSelected = function ( value ) {
    if ( arguments.length ) {
      _selected = value;
    } else {
      return _selected;
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };

  $scope.selectOption = function ( item, model, label ) {
    $state.go( 'oneSong', {
      songId: item.id
    } );
  };
} );

let searchBarTemplate = `
        <div class="input-group">
            <input
              type="text"
              ng-model="queryString"
              placeholder="...search for a song"
              uib-typeahead="song as song.title for song in songs"
              typeahead-on-select="selectOption($item, $model, $label)"
              typeahead-template-url="/js/common/directives/search-bar/typeahead-template.html" class="form-control" typeahead-show-hint="true"
              typeahead-min-length="0"
              ng-keyUp = "updateSongs(queryString)" >
            </input>
            <span class="input-group-btn">
            </span>
        </div>
`;
