document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita el envío del formulario

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const celular = document.getElementById("celular").value;

    try {
      const response = await fetch("/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo, celular }),
      });
      const result = await response.json();

      // Mostrar el mensaje en el contenedor
      const messageContainer = document.getElementById("responseMessage");
      messageContainer.textContent = result.message;
      messageContainer.style.color = result.success ? "green" : "red";

      // Resetear el formulario si se envió correctamente
      if (result.success) {
        document.getElementById("contactForm").reset();
      }
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      document.getElementById("responseMessage").textContent =
        "Error al enviar el formulario";
      document.getElementById("responseMessage").style.color = "red";
    }
  });
