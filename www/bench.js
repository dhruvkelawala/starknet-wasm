export const bench = (name, fn) => {
  const start = performance.now();
  const res = fn();
  const end = performance.now();
  document.body.appendChild(
    document.createElement("h2")
  ).innerHTML = `${name}: ${end - start}`;
    
    return res
};
