//coreccion del app
const Nodo = (valor) => ({
    valor,
    izquierda: null,
    derecha: null,
});

const generarArbol = () => {
    const expresion = document.getElementById('expression').value;

    // Validar que no haya números negativos que no sean parte de la expresión
    if (expresion.match(/-[\d()]/) && !expresion.match(/^[\d()]+[-+*/][\d()]+$/)) {
        alert('No se permiten números negativos en la expresión.');
        return;
    }

    try {
        const arbol = construirArbol(expresion);
        const contenedorArbol = document.getElementById('treeContainer');
        contenedorArbol.innerHTML = ''; // Limpiar cualquier contenido previo
        renderizarArbol(arbol, contenedorArbol);
    } catch (e) {
        alert('Expresión inválida. Por favor, introduce una expresión matemática correcta.');
        console.error(e);
    }
};

// Función para construir el árbol de expresiones
const construirArbol = (expresion) => {
    expresion = expresion.replace(/\s+/g, ''); // Eliminar espacios en blanco
    const tokens = tokenizar(expresion);

    if (tokens.length === 1) {
        return Nodo(tokens[0]);
    }

    const indiceOperador = encontrarOperadorPrincipal(tokens);
    if (indiceOperador === -1) {
        throw new Error("Expresión no válida");
    }

    const raiz = Nodo(tokens[indiceOperador]);
    raiz.izquierda = construirArbol(tokens.slice(0, indiceOperador).join(''));
    raiz.derecha = construirArbol(tokens.slice(indiceOperador + 1).join(''));

    return raiz;
};

// Tokenizar la expresión matemática
const tokenizar = (expresion) => {
    const tokens = [];
    let numero = '';
    let nivelParentesis = 0;

    for (let i = 0; i < expresion.length; i++) {
        const char = expresion[i];

        if (char === '(') {
            if (nivelParentesis > 0) {
                numero += char;
            }
            nivelParentesis++;
        } else if (char === ')') {
            nivelParentesis--;
            if (nivelParentesis > 0) {
                numero += char;
            } else if (nivelParentesis === 0) {
                tokens.push(numero);
                numero = '';
            }
        } else if (nivelParentesis > 0) {
            numero += char;
        } else if (/\d/.test(char) || (char === '-' && (i === 0 || tokens[tokens.length - 1] === '(' || ['+', '-', '*', '/'].includes(tokens[tokens.length - 1])))) {
            numero += char;
        } else {
            if (numero) {
                tokens.push(numero);
                numero = '';
            }
            tokens.push(char);
        }
    }

    if (numero) {
        tokens.push(numero);
    }

    return tokens;
};

// Encontrar el operador principal fuera de paréntesis
const encontrarOperadorPrincipal = (tokens) => {
    let nivel = 0;
    const precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };
    let minimaPrecedencia = Infinity;
    let indice = -1;

    tokens.forEach((token, i) => {
        if (token === '(') {
            nivel++;
        } else if (token === ')') {
            nivel--;
        } else if (precedencia[token] && nivel === 0) {
            if (precedencia[token] <= minimaPrecedencia) {
                minimaPrecedencia = precedencia[token];
                indice = i;
            }
        }
    });

    return indice;
};

// Función para renderizar el árbol de manera gráfica
const renderizarArbol = (nodo, contenedor) => {
    if (!nodo) return;//si  los datos estan vacios no va a mostrar nada por pantalla

    const nodoElemento = document.createElement('div');
    nodoElemento.className = 'node';
    nodoElemento.textContent = nodo.valor;

    contenedor.appendChild(nodoElemento);

    if (nodo.izquierda || nodo.derecha) {
        const contenedorRamas = document.createElement('div');
        contenedorRamas.className = 'branch';

        if (nodo.izquierda) {
            const contenedorIzquierda = document.createElement('div');
            contenedorRamas.appendChild(contenedorIzquierda);
            renderizarArbol(nodo.izquierda, contenedorIzquierda);
        }

        if (nodo.derecha) {
            const contenedorDerecha = document.createElement('div');
            contenedorRamas.appendChild(contenedorDerecha);
            renderizarArbol(nodo.derecha, contenedorDerecha);
        }

        contenedor.appendChild(contenedorRamas);
    }
};
//// no tener limite de expresiones