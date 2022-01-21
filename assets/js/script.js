// inicializa el nodo del id Button
const form = document.querySelector("form");
const boton = document.querySelector("button[type=submit]");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // base url api user
  const API_USER = `https://api.github.com/users`;

  // encargada de solicitar los datos
  const request = async (url) => {
    const results = await fetch(url);
    const response = await results.json();
    return response;
  };

  // crea la url de usuarios y solicita informacion
  const getUser = async (nombre) => {
    const url = `${API_USER}/${nombre}`;
    return request(url);
  };

  // crea la url de repositorios y solicita informacion
  const getRepo = async (user, pagina, cantidad_repos) => {
    const url =
      "https://api.github.com/users/" +
      user +
      "/repos?page=" +
      pagina +
      "&per_page=" +
      cantidad_repos;

    return request(url);
  };

  // captura los datos del usuario instanciando la funcion
  const data = registrando();

  // valida las promesas  y entrega la informacion
  Promise.all([
    getUser(data.user),
    getRepo(data.user, data.pagina, data.cantidad_repos),
  ])
    .then((response) => {
      // resultados
      const user = response[0];
      console.log(user);
      const repos = response[1];
      console.log(repos);

      // desplega un objecto con los datos a utilizar en el dom
      let arrUser = {
        userName: user.name,
        loginName: user.login,
        nRepositories: user.public_repos,
        localidad: user.location,
        userType: user.type,
      };

      // pinta la informacion en el DOM
      printUserInfo(arrUser, repos, data.cantidad_repos);
    })
    .catch((err) => console.log("err", err));

  /**********************FUNCIONES********************************* */

  // captura los valores de los input otorgados por el usuario
  // creando un object con la informacion
  function registrando() {
    const user = document.getElementById("nombre").value;
    const pagina = document.getElementById("pagina").value;
    const cantidad_repos = document.getElementById("repoPagina").value;

    if (
      user === "" ||
      user === " " ||
      !isNaN(user) ||
      pagina === "" ||
      pagina === " " ||
      cantidad_repos === "" ||
      cantidad_repos === " "
    ) {
      resetForm(form);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
      });
      alert("No dejes en blanco tu formulario 😫");
      return null;
    } else {
      let data = {
        user: document.getElementById("nombre").value,
        pagina: document.getElementById("pagina").value,
        cantidad_repos: document.getElementById("repoPagina").value,
      };
      return data;
    }
  }

  // reset formulario
  function resetForm(form) {
    form.reset();
  }

  // printing info en el dom
  function printUserInfo(arrUser, repos, nRepositories) {
    // captura el nodo de resultados
    const div = document.getElementById("resultados");
    div.setAttribute("style", "display:flex;justify-content:space-between");
    // crea un div para alojar la info del usuario
    const div_dos = document.createElement("div");
    div_dos.setAttribute("id", "infoUser");

    // cea un div para alojar los datos del repositorio
    const div_tres = document.createElement("div");
    div_tres.setAttribute("id", "infoRepos");
    const ul = document.createElement("ul");

    // establece un timeout para evitar errores de appendchild
    setTimeout(() => {
      div.appendChild(div_dos);
      div.appendChild(div_tres);
    }, 500);

    // establece un timeout para evitar errores de appendchild
    setTimeout(() => {
      div_tres.appendChild(ul);
    }, 700);

    // pinta la informacion en el documento
    setTimeout(() => {
      for (let i = 0; i < Object.keys(arrUser).length; i++) {
        // crea el elementp p
        let p = document.createElement("p");
        // crea un elemento div
        if (Object.keys(arrUser)[i] === "userName") {
          p.innerHTML = `Nombre de usuario: ${arrUser.userName}`;
          div_dos.appendChild(p);
        } else if (Object.keys(arrUser)[i] === "loginName") {
          p.innerHTML = `Nombre de login: ${arrUser.loginName}`;
          div_dos.appendChild(p);
        } else if (Object.keys(arrUser)[i] === "nRepositories") {
          p.innerHTML = `Numero de repositorios: ${arrUser.nRepositories}`;
          div_dos.appendChild(p);
        } else if (Object.keys(arrUser)[i] === "localidad") {
          p.innerHTML = `Localidad: ${arrUser.localidad}`;
          div_dos.appendChild(p);
        } else if (Object.keys(arrUser)[i] === "userType") {
          p.innerHTML = `Tipo de usuario: ${arrUser.userType}`;
          div_dos.appendChild(p);
        }
      }

      // se encarga de pintar la info de los repositorios segun cuantos se quieran ver
      for (let i = 0; i < nRepositories; i++) {
        const li = document.createElement("li");
        li.style.listStyle = "none";
        li.innerHTML = `<a href="${repos[i].html_url}">${[i + 1]}. ${
          repos[i].name
        }</a>`;
        ul.appendChild(li);
      }
    }, 1000);
    resetForm(form);
  }
});
