const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Orden personalizado de pruebas
    const order = [
      "1product.test.ts",
      "2cart.test.ts"
    ];

    // Ordenar tests según el array `order`
    return tests.sort((a, b) => {
      const indexA = order.indexOf(a.path.split('/').pop());
      const indexB = order.indexOf(b.path.split('/').pop());
      return indexA - indexB;
    });
  }
}

module.exports = CustomSequencer;