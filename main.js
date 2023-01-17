const app = Vue.createApp({
  data() {
    return {
      browseLog: [],
      caseSwitch: 'insensitive',
      currentPlace: '',
      places: [],
      regexp: '',
      searchString: '',
      searchResultNum: '',
    };
  },

  computed: {
    allPlaces() {
      let flags;

      if (this.caseSwitch === 'insensitive') {
        flags = 'gi';
      } else {
        flags = 'g';
      }

      this.regexp = new RegExp(
        this.escapeSpecialCharacters(this.searchString),
        flags
      );

      const arr = this.places.filter((place) => place.Name.match(this.regexp));
      this.searchResultNum = arr.length;

      return arr;
    },
  },

  methods: {
    escapeSpecialCharacters(searchString) {
      return searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
  },

  watch: {
    currentPlace(newValue) {
      if (this.browseLog.includes(newValue)) {
        this.browseLog.splice(this.browseLog.indexOf(newValue), 1);
      }

      if (this.browseLog.length >= 10) {
        this.browseLog.shift();
      }

      this.browseLog.push(newValue);
    },
  },

  created() {
    axios
      .get(
        'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json'
      )
      .then((res) => {
        this.places = res.data.result.records;
      })
      .catch((err) => console.log(err));
  },
});

app.mount('#app');
