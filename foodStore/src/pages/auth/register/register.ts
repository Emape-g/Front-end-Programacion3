const registerForm = document.getElementById("register-form") as HTMLFormElement;
const nameReg = document.getElementById("register-name") as HTMLInputElement;
const lastnameReg = document.getElementById("register-lastname") as HTMLInputElement;
const emailReg = document.getElementById("register-email") as HTMLInputElement;
const phoneReg = document.getElementById("register-phoneNumber") as HTMLInputElement;
const passwordReg = document.getElementById("register-password") as HTMLInputElement;
const confirmPasswordReg = document.getElementById("register-password-confirm") as HTMLInputElement;
const loaderRegister = document.getElementById("loader") as HTMLElement;

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loaderRegister.classList.remove("hidden");

  const name = nameReg.value.trim();
  const lastname = lastnameReg.value.trim();
  const email = emailReg.value.trim();
  const phone = phoneReg.value.trim();
  const password = passwordReg.value.trim();
  const confirmPassword = confirmPasswordReg.value.trim();

  if (!name || !lastname || !email || !phone || !password || !confirmPassword) {
    alert("Por favor completá todos los campos.");
    loaderRegister.classList.add("hidden");
    return;
  }

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    loaderRegister.classList.add("hidden");
    return;
  }
console.log({
  nombre: name,
  apellido: lastname,
  email: email,
  celular: phone,
  contrasena: password
});
  try {
    const response = await fetch(
      "http://localhost:8080/api/usuarios/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name,
          apellido: lastname,
          email: email,
          celular: phone, // <-- o Number(phone.replace(/^0+/, "")) si backend usa int
          contrasena: password,
        }),
      }
    );

    const data = await response.json();
console.log(data);

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data.nombre));
      window.location.href = "/index.html";
    } else {
      alert(data.message || "Error en el registro");
    }
  } catch (error) {
    alert("Error: " + error);
  } finally {
    loaderRegister.classList.add("hidden");
  }
});
