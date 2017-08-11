'use strict';

var STORAGE_KEY = 'dddMelbourne2017';

var app = new Vue({
  el: '#app',
  data: {
    showHelp: true,
    agenda: []
  },
  mounted: function() {
    this.loadAgenda();
  },
  methods: {
    loadAgenda: function() {
      this.agenda = this.getAgendaFromLocalStorage() || this.getAgendaFromPageData();
    },
    getAgendaFromLocalStorage: function() {
      try {
        var agendaJson = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(agendaJson);
      } catch (e) {
        return null;
      }
    },
    getAgendaFromPageData: function() {
      var agendaJson = document.getElementById('agenda-data').textContent;
      return JSON.parse(agendaJson);
    },
    removeTimeslot: function(timeslot) {
      this.agenda = this.agenda.filter(function (x) {
        return x !== timeslot;
      });
    },
    removeTalk: function(timeslot, talk) {
      timeslot.talks = timeslot.talks.filter(function (x) {
        return x !== talk;
      });
      if (timeslot.talks.length === 0) {
        this.removeTimeslot(timeslot);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.agenda));
    },
    print: function() {
      window.print();
    },
    reset: function() {
      localStorage.removeItem(STORAGE_KEY);
      this.agenda = this.getAgendaFromPageData();
    }
  }
});

Vue.component('my-timeslot', {
  props: ['model'],
  template: '#my-timeslot-template',
  methods: {
    removeTalk: function(talk) {
      this.$emit('remove-talk', this.model, talk);
    }
  }
});

Vue.component('my-talk', {
  props: ['model', 'showRemove'],
  template: '#my-talk-template',
  data: function() {
    return {
      showAbstract: false
    };
  },
  methods: {
    removeTalk: function() {
      this.$emit('remove', this.model);
    }
  }
});

/*
// To extract data from DDD site (https://www.dddmelbourne.com/agenda/):

JSON.stringify(Array.from($('.agenda-list').map(function() { 
  return {
      timeslot: $('h3', this).text(), 
      talks: Array.from($(this).children('a, div').map(function() { 
          return {
              room: $('.area', this).text(),
              title: $('.info', this).text(),
              speaker: $('.speaker', this).text(),
              twitter: $($('.twitter', this).text().replace(/[\[\]]/g, '')).attr('href'),
              website: $($('.website', this).text().replace(/[\[\]]/g, '')).attr('href'),
              abstract: $('.abstract', this).text()
            }; 
        }))
    }; 
}))).replace(/</g, '%3C').replace(/>/g, '%3E');
*/