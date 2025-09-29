const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      window.location.href = "index.html";
    }

    document.getElementById("info").innerHTML =
      `<p><strong>Código:</strong> ${usuario.codigo} <br>
       <strong>Nombre:</strong> ${usuario.nombre || ''}</p>`;

    async function cargarNotas() {
      try {
        const resp = await fetch(
          `https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${usuario.codigo}/notas`
        );

        console.log("Status:", resp.status);

        // leer JSON UNA sola vez (no leer text() y luego json())
        const data = await resp.json().catch(() => null);
        console.log("Respuesta API:", data);

        // detectar la forma de la respuesta
        let notasArr = null;
        if (!data) {
          notasArr = null;
        } else if (Array.isArray(data)) {
          notasArr = data;
        } else if (data.notas && Array.isArray(data.notas)) {
          notasArr = data.notas;
        } else {
          notasArr = null;
        }

        if (!notasArr || notasArr.length === 0) {
          document.getElementById("tablaNotas").innerHTML =
            `<tr><td colspan="7">No hay notas registradas para este estudiante.</td></tr>`;
          document.getElementById("promedio").innerText = "";
          return;
        }

        let totalCreditos = 0;
        let sumaPonderada = 0;

        const filas = notasArr.map(n => {
          // soporta tanto n1/n2/n3/ex como p1/p2/p3/ef si en algún caso cambian
          const p1 = parseFloat(n.n1 ?? n.p1 ?? 0) || 0;
          const p2 = parseFloat(n.n2 ?? n.p2 ?? 0) || 0;
          const p3 = parseFloat(n.n3 ?? n.p3 ?? 0) || 0;
          const ef = parseFloat(n.ex ?? n.ef ?? 0) || 0;
          const creditos = parseInt(n.creditos ?? n.credito ?? 0, 10) || 0;

          // fórmula: def = ((p1+p2+p3)/3)*0.7 + ef*0.3
          const promedioParciales = (p1 + p2 + p3) / 3;
          const def = (promedioParciales * 0.7) + (ef * 0.3);

          sumaPonderada += def * creditos;
          totalCreditos += creditos;

          return `<tr>
            <td>${n.asignatura}</td>
            <td>${creditos}</td>
            <td>${p1.toFixed(2)}</td>
            <td>${p2.toFixed(2)}</td>
            <td>${p3.toFixed(2)}</td>
            <td>${ef.toFixed(2)}</td>
            <td>${def.toFixed(2)}</td>
          </tr>`;
        }).join("");

        document.getElementById("tablaNotas").innerHTML = filas;

        const promedio = totalCreditos ? (sumaPonderada / totalCreditos).toFixed(2) : "0.00";
        document.getElementById("promedio").innerText = "Promedio ponderado: " + promedio;

      } catch (err) {
        console.error("Error cargando notas", err);
        document.getElementById("tablaNotas").innerHTML =
          `<tr><td colspan="7">Error cargando notas (ver consola)</td></tr>`;
      }
    }

    cargarNotas();

    document.getElementById("cerrar").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "index.html";
    });