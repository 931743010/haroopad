define([
		'tabs/General.opt'
	], function(options) {

		var moment = require('moment');
    moment.lang(navigator.language.toLowerCase());
    
		var config = options.toJSON();

		options.bind('change', function(model) {
			var prop, en,
				data = model.changedAttributes();

			for (prop in data) {
				en = 'preferences.general.'+ prop;
				window.parent.ee.emit(en, data[prop]);
			}
		});

		var GeneralTabView = Backbone.View.extend({
			el: '#general-tab',

			events: {
				'click input[name=enableAutoComplete]': 'enableAutoComplete',	
				'click input[name=enableSyncScroll]': 'enableSyncScroll',	
				'click input[name=enableLastFileRestore]': 'enableLastFileRestore',
				// 'change select[name=displayLanguage]': 'changeDisplayLanguage',
				'click input[name=playKeypressSound]': 'playKeypressSound',
				'change select[name=dateTime]': 'changeDateFormat'
			},

			formats: [ 'l', 'L', 'll', 'LL', 'lll', 'LLL', 'llll', 'LLLL' ],

			initialize: function() {
				this.$('input[name=enableAutoComplete]').prop('checked', config.enableAutoComplete);
				this.$('input[name=enableSyncScroll]').prop('checked', config.enableSyncScroll);
				this.$('input[name=enableLastFileRestore]').prop('checked', config.enableLastFileRestore);
				this.$('input[name=playKeypressSound]').prop('checked', config.playKeypressSound);

				// this._setLanguage();
			},

			_setLanguage: function() {
				var optEl, lang, langs = global.LANGS;
				var parent = document.querySelector('select[name=displayLanguage]');

				for(lang in langs) {
					optEl = document.createElement('option');
					optEl.setAttribute('value', lang);
					optEl.innerHTML = langs[lang].name;

					parent.appendChild(optEl);
				}

				this.$('select[name=displayLanguage]').select2({
					width: '180px'
				}).select2('val', config.displayLanguage);

				this.formats.forEach(function(prop) {
					var option = $('<option>').attr('value', prop).text(moment(8806).format(prop));
					this.$('select[name=dateTime]').append(option);
				});

				this.$('select[name=dateTime]').select2({
        	placeholder: "Select Date and Format",
					width: '300px'
				}).select2('val', config.dateFormat);
			},

			enableAutoComplete: function(e) {
				var bool = $(e.target).is(':checked');
				options.set('enableAutoComplete', bool);
			},

			enableSyncScroll: function(e) {
				var bool = $(e.target).is(':checked');
				options.set('enableSyncScroll', bool);
			},

			enableLastFileRestore: function(e) {
				var bool = $(e.target).is(':checked');
				options.set('enableLastFileRestore', bool);
			},

			changeDisplayLanguage: function(e) {
				options.set('displayLanguage', e.val);
			},

			changeDateFormat: function(e) {
				options.set('dateFormat', e.val);
			},

			playKeypressSound: function(e) {
				var bool = $(e.target).is(':checked');
				options.set('playKeypressSound', bool);
			}
		});

		return new GeneralTabView;

});