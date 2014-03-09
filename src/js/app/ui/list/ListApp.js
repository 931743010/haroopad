define([
    'ui/list/DocView',
    'ui/list/DocModel',
    'ui/list/DocList'
  ], function(DocView, DocModel, DocList) {

    var updateTimeOut, docId = '';

  var ListApp = Backbone.View.extend({

    el: '#list',

    events: {
      'click >div': 'clickHandler'
    },

    initialize: function() {
      this.listenTo(DocList, 'add', this.addOne);

      DocList.fetch();
    },

    add: function(doc) {
      console.log('new one');
      DocList.add(doc, { index: 0, silent: true });
      console.log(doc);

      this.newOne(new DocModel(doc));
    },

    more: function() {
      DocList.more();
    },

    updateDoc: function(str) {
      var doc = DocList.get(docId);
      doc.set({ markdown: str });

      clearTimeout(updateTimeOut);
      updateTimeOut = setTimeout(function() {
        doc.set({ update_at: new Date() });
        doc.save();
      }, 500);
    },

    newOne: function(doc) {
      var view = new DocView({ model: doc });
      this.$el.prepend(view.render().el);
    },

    addOne: function(doc) {
      var view = new DocView({ model: doc });
      this.$el.append(view.render().el);
    },

    addAll: function() {
      DocList.each(this.addOne, this);
    },

    clickHandler: function(e) {
      var el = e.currentTarget;

      docId && $('#'+ docId).removeClass('active');
      $(el).addClass('active');

      docId = el.id;

      this.trigger('select', DocList.get(docId));
    }
  });

  var app = new ListApp();

  return app;

});