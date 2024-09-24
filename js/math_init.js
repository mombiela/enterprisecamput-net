MathJax = {
  loader: {load: ['input/tex', 'input/asciimath', 'output/chtml']},
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  asciimath: {
    delimiters: [['`', '`']]
  }
};

function mathReload() {
	
  try {
    console.log("Cargando math....");
    
    // Seleccionamos solo los elementos que tengan la clase 'math'
    let elements = document.querySelectorAll('.math');
    
    // Usamos MathJax.typesetPromise para procesar solo esos elementos
    MathJax.typesetPromise(elements).then(() => {
      console.log("Math OK math: " + elements.length);
    }).catch((err) => {
      console.log("Error en MathJax:", err);
    });

    elements = document.querySelectorAll('.content');
    
    // Usamos MathJax.typesetPromise para procesar solo esos elementos
    MathJax.typesetPromise(elements).then(() => {
      console.log("Math OK content: " + elements.length);
    }).catch((err) => {
      console.log("Error en MathJax:", err);
    });

  } catch (e) {
    console.log(e);
  }
}
