(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sideBarMenu'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-author-menu form-author-menu__open\">\n    <div class=\"search-form\">\n        <input type=\"text\" id=\"search-input\" placeholder=\"Введите адрес\">\n        <span class=\"search-icon material-symbols-outlined\" id=\"search-icon-button\">search</span>\n    </div>\n    <div id=\"search_result\"></div>\n    <button class=\"secondary-button\" id=\"author-menu-check-button\">\n        <label>Мои парковки</label>\n    </button>\n    <div class=\"user-parkings-container\" id=\"user-park-container\"></div>\n    <span id=\"author-menu-close-button\" class=\"material-symbols-outlined\">menu_open</span>\n</div>";
},"useData":true});
})();