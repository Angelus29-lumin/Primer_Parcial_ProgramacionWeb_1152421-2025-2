    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("error");

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = document.getElementById("codigo").value;
    const clave = document.getElementById("clave").value;

    try {
        const response = await fetch("https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, clave })
        });

        if (!response.ok) throw new Error("Error en la petición");

        const data = await response.json();

        if (data && data.codigo) {
        // ✅ Login válido
        localStorage.setItem("usuario", JSON.stringify(data));
        window.location.href = "notas.html"; // redirige a interfaz de notas
        } else {
        // ❌ Login inválido
        errorMsg.style.display = "block";
        document.getElementById("codigo").value = "";
        document.getElementById("clave").value = "";
        }
        // 1151158
    } catch (error) {
        errorMsg.style.display = "block";
        document.getElementById("codigo").value = "";
        document.getElementById("clave").value = "";
    }
    });