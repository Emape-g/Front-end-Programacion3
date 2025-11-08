const form = document.getElementById("login-form") as HTMLFormElement;
const emailLog = document.getElementById("login-email") as HTMLInputElement;
const passwordLog = document.getElementById(
  "login-password"
) as HTMLInputElement;


const loader = document.getElementById("loader") as HTMLElement;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  loader.classList.remove("hidden"); // 🔹 Mostrar loader

  const email = emailLog.value.trim();
  const password = passwordLog.value.trim();

  if (!email || !password) {
    alert("Por favor completá los campos.");
    loader.classList.add("hidden"); // 🔹 Ocultar si hay error
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/usuarios/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailLog.value,
          contrasena: passwordLog.value,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data.nombre));
      localStorage.setItem("id", JSON.stringify(data.id))
      window.location.href = "../../../../index.html";
    } else {
      alert(data.message || "Error en el login");
    }
  } catch (error) {
    alert("Error de conexión");
  } finally {
    loader.classList.add("hidden"); // 🔹 Ocultar siempre al finalizar
  }
});



