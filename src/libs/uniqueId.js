export default (() => {
  const generate = function* () {
    let increment = 0;
    while (true) {
      yield increment;
      increment += 1;
    }
  };
  const increment = generate();
  return () => increment.next().value;
})();
