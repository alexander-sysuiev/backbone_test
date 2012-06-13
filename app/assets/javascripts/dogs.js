$(function(){
  window.Dog = Backbone.Model.extend({
    url: function(){
      return this.id ? '/dogs/' + this.id : '/dogs'
    },

    initialize: function(){
    }
  });

  window.DogCollection = Backbone.Collection.extend({
    model: Dog,
    url: '/dogs'
  });

  window.Dogs = new DogCollection;

  window.DogView = Backbone.View.extend({
    tagName: 'tr',
    events: {
    },

    initialize: function(){
    },

    render: function(){
      dog = this.model;
      $(this.el).html(ich.dog_template(dog));
      return this;
    }
  });

  window.AppView = Backbone.View.extend({
    el: $('#dogs_app'),
    events: {
      'submit form#new_dog': 'createDog'
    },

    initialize: function(){
      _.bindAll(this, "addOne", "addAll");
      Dogs.bind("add", this.addOne);
      Dogs.bind("refresh", this.addAll);
      Dogs.bind("all", this.addAll);

      Dogs.fetch();
    },

    addOne: function(dog){
      var view = new DogView({model: dog});
      this.$("#dog_table").append(view.render().el);
    },

    addAll: function(){
      $("#dog_table").html('');
      Dogs.each(function(dog){
        var view = new DogView({model: dog['attributes']})
        $("#dog_table").append(view.render().el);
      });
    },

    newAttributes: function(event){
      var new_dog_form = $(event.currentTarget).serializeArray();

      name = _.find(new_dog_form, function(obj){return obj['name'] == "dog[name]"})['value'];
      age = _.find(new_dog_form, function(obj){return obj['name'] == "dog[age]"})['value'];

      return {dog: {
        name: name,
        age: age
      }}
    },

    createDog: function(e){
      e.preventDefault();
      var params = this.newAttributes(e);
      Dogs.create(params['dog']);
    }
  });

  window.App = new AppView;
});
