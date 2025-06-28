const form = document.getElementById("formulario");
const modal = document.querySelector(".modal");
const btnCerrar = document.querySelector(".cerrar");
const modalData = document.querySelector("#modal__data")

const fields = {
  nombre: {
    validate: (v) => v.trim().length > 6 && v.trim().includes(" "),
    error: "Debe tener más de 6 letras y al menos un espacio.",
  },
  email: {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    error: "Debe ser un email válido.",
  },
  password: {
    validate: (v) => /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(v),
    error: "Mínimo 8 caracteres, incluyendo letras y números.",
  },
  repetir: {
    validate: (v) => v === document.getElementById("password").value,
    error: "Las contraseñas no coinciden.",
  },
  edad: {
    validate: (v) => /^\d+$/.test(v) && parseInt(v) >= 18,
    error: "Debe ser un número entero mayor o igual a 18.",
  },
  telefono: {
    validate: (v) => /^\d{7,}$/.test(v),
    error: "Debe tener al menos 7 dígitos, sin espacios ni guiones.",
  },
  direccion: {
    validate: (v) => /^[a-zA-Z0-9]+\s[a-zA-Z0-9\s]{3,}$/.test(v),
    error: "Mínimo 5 caracteres, con letras, números y un espacio.",
  },
  ciudad: {
    validate: (v) => v.trim().length >= 3,
    error: "Debe tener al menos 3 caracteres.",
  },
  codigoPostal: {
    validate: (v) => v.trim().length >= 3,
    error: "Debe tener al menos 3 caracteres.",
  },
  dni: {
    validate: (v) => /^\d{7,8}$/.test(v),
    error: "Debe ser un número de 7 u 8 dígitos.",
  },
};

//Funcion para agregar evento de validacion
const addListeners = (key) => {
  const input = document.getElementById(key);
  const group = document.getElementById(`group-${key}`);
  const errorDiv = document.getElementById(`error-${key}`);

  input.addEventListener("blur", () => {
    const valid = fields[key].validate(input.value);
    group.classList.remove(
      "formulario__grupo--incorrecto",
      "formulario__grupo--correcto"
    );
    if (!valid) {
      errorDiv.textContent = fields[key].error;
      group.classList.add("formulario__grupo--incorrecto");
    } else {
      errorDiv.textContent = "";
      group.classList.add("formulario__grupo--correcto");
    }
  });

  input.addEventListener("focus", () => {
    errorDiv.textContent = "";
    group.classList.remove("formulario__grupo--incorrecto");
  });
};

//Agrego las validaciones
Object.keys(fields).forEach(addListeners);

//Evento submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  let output = [];

  for (let key in fields) {
    const input = document.getElementById(key);
    const group = document.getElementById(`group-${key}`);
    const errorDiv = document.getElementById(`error-${key}`);

    if (!fields[key].validate(input.value)) {
      errorDiv.textContent = fields[key].error;
      group.classList.add("formulario__grupo--incorrecto");
      isValid = false;
    } else {
      group.classList.remove("formulario__grupo--incorrecto");
      group.classList.add("formulario__grupo--correcto");
      output.push(`${key}: ${input.value}`);
    }
  }

  if (isValid) {
    const datos = {};
    for (let key in fields) {
      const input = document.getElementById(key);
      datos[key] = input.value.trim();
    }
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((response) => response.json())
      .then((data) => {
        modal.style.display = "flex";
        modalData.innerText = JSON.stringify(data)
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el formulario");
      });
    localStorage.setItem("formularioDatos", JSON.stringify(datos));
  } else {
    alert("Errores en el formulario. Corrige los campos indicados.");
  }
});

//CAMBIAR TITULO
const nombreInput = document.getElementById("nombre");
const tituloFormulario = document.getElementById("title");

nombreInput.addEventListener("input", () => {
  const valor = nombreInput.value.trim();
  tituloFormulario.textContent = valor !== "" ? `Hola ${valor}` : "Hola";
});

//Cargar datos del local storage
const datosGuardados = localStorage.getItem("formularioDatos");
if (datosGuardados) {
  const datos = JSON.parse(datosGuardados);
  for (let key in datos) {
    const input = document.getElementById(key);
    if (input) {
      input.value = datos[key];
    }
  }

  // Actualizo el titulo si ya estaba el nombre
  const nombreInicial = datos["nombre"]?.trim();
  if (nombreInicial) {
    tituloFormulario.textContent = `Hola ${nombreInicial}`;
  }
}


// Cerrar modal al hacer click en (X)
btnCerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
