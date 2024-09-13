const Nodo = (valor) => ({
    valor,
    izquierda: null,
    derecha: null,
});

const generarArbol = () => {
    const expresion = document.getElementById('expression').value;

    try {
        const expresionModificada = agregarMultiplicacionImplicita(expresion);
        const arbol = construirArbol(expresionModificada);
        const contenedorArbol = document.getElementById('treeContainer');
        contenedorArbol.innerHTML = ''; // Limpiar cualquier contenido previo
        renderizarArbol(arbol, contenedorArbol);

        // Mostrar los recorridos preorden, inorden y postorden
        document.getElementById('preorden').textContent = recorrerPreorden(arbol).join(' ');
        document.getElementById('inorden').textContent = recorrerInorden(arbol).join(' ');
        document.getElementById('postorden').textContent = recorrerPostorden(arbol).join(' ');

    } catch (e) {
        alert('Expresión inválida. Por favor, introduce una expresión matemática correcta.');
        console.error(e);
    }
};

// Función para recorrer el árbol en preorden (raíz, izquierda, derecha)
const recorrerPreorden = (nodo) => {
    if (nodo === null) return [];
    return [nodo.valor].concat(recorrerPreorden(nodo.izquierda), recorrerPreorden(nodo.derecha));
};

// Función para recorrer el árbol en inorden (izquierda, raíz, derecha)
const recorrerInorden = (nodo) => {
    if (nodo === null) return [];
    return recorrerInorden(nodo.izquierda).concat([nodo.valor], recorrerInorden(nodo.derecha));
};

// Función para recorrer el árbol en postorden (izquierda, derecha, raíz)
const recorrerPostorden = (nodo) => {
    if (nodo === null) return [];
    return recorrerPostorden(nodo.izquierda).concat(recorrerPostorden(nodo.derecha), [nodo.valor]);
};

// Función para agregar operadores de multiplicación implícitos cuando sea necesario
const agregarMultiplicacionImplicita = (expresion) => {
    let nuevaExpresion = '';
    expresion.split('').map((charActual, i) => {
        const charSiguiente = expresion[i + 1];

        nuevaExpresion += charActual;

        if ((/\d/.test(charActual) && charSiguiente === '(') || 
            (charActual === ')' && (charSiguiente === '(' || /\d/.test(charSiguiente)))) {
            nuevaExpresion += '*';
        }
    });

    return nuevaExpresion;
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

    expresion.split('').map((char, i) => {
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
    });

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

    tokens.map((token, i) => {
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
    if (!nodo) return;

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
// Función para limpiar el árbol y los recorridos
const limpiarArbol = () => {
    document.getElementById('treeContainer').innerHTML = ''; // Limpiar el contenedor del árbol
    document.getElementById('preorden').textContent = '';    // Limpiar el preorden
    document.getElementById('inorden').textContent = '';     // Limpiar el inorden
    document.getElementById('postorden').textContent = '';   // Limpiar el postorden
    document.getElementById('expression').value = '';        // Limpiar el campo de entrada de la expresión
};
