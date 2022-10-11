import numeral from 'numeral';

// load a locale
try {

  numeral.register('locale', 'fr', {
    delimiters: {
      thousands: ' ',
      decimal: ','
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function (number) {
      return number === 1 ? 'er' : 'ème';
    },
    currency: {
      symbol: '€'
    }
  });
} catch (e) {
  console.error(e);
}

// switch between locales
numeral.locale('fr');

export default numeral;