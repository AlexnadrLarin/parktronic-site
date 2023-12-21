(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['authorMenu'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-author-menu form-author-menu__open\">\n    <div class=\"search__container\" id=\"search__container\">\n        <input class=\"search__input\" type=\"text\" placeholder=\"Поиск\" id=\"search__input\">\n        <button class=\"search__button\" type=\"submit\"><i class=\"fa fa-search\"></i></button>\n    </div>\n    <div class=\"user-parkings-container\" id=\"user-park-container\">\n        <button class=\"secondary-button\" id=\"author-menu-close-button\">\n            <label>Мои парковки</label>\n        </button>\n    </div>\n<!--    <span id=\"author-menu-close-button\" class=\"material-symbols-outlined\">menu_open</span>-->\n</div>\n\n\n";
},"useData":true});
})();