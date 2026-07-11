const USUARIO_VALIDO = {
    matricula: "2025452046",
    password: "2025452046"
};

const MATERIAS_DATA = [
    { num: 1, docente: "GARDUÑO FLORES FRANCISCO ADRIÁN", materia: "FUNDAMENTOS DE PROGRAMACIÓN", p1: 94, p2: 96, p3: 100, grupo: "1ISC21" },
    { num: 2, docente: "RAMIREZ HIDALGO JUAN ALBERTO", materia: "ÁLGEBRA LINEAL", p1: 100, p2: 97, p3: 95, grupo: "2ISC11" },
    { num: 3, docente: "CRUZ MONTIEL MARIO", materia: "CÁLCULO INTEGRAL", p1: 100, p2: 100, p3: 95, grupo: "2ISC11" },
    { num: 4, docente: "ZAMORA TÉLLEZ MERCEDES DAMARIS", materia: "CONTABILIDAD FINANCIERA", p1: 100, p2: 98, p3: 100, grupo: "2ISC11" },
    { num: 5, docente: "MENDEZ CALVA JULIO CESAR", materia: "PROBABILIDAD Y ESTADÍSTICA", p1: 96, p2: 98, p3: 100, grupo: "2ISC11" },
    { num: 6, docente: "LLINAS PEREZ MARCO ANTONIO", materia: "PROGRAMACIÓN ORIENTADA A OBJETOS", p1: 86, p2: 100, p3: 100, grupo: "2ISC11" },
    { num: 7, docente: "SOLIS PEREZ SHARON", materia: "QUÍMICA", p1: 100, p2: 100, p3: 100, grupo: "2ISC11" }
];

const loginForm = document.getElementById('login-form');
const loginPageContainer = document.getElementById('login-page-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginError = document.getElementById('login-error');
const gradesTableBody = document.getElementById('grades-table-body');
const finalGradesTableBody = document.getElementById('final-grades-table-body');
const logoutBtn = document.getElementById('logout-btn');
const reportesSubmenu = document.getElementById('reportes-submenu');

const mainButtons = document.querySelectorAll('.sidebar-menu .menu-btn:not(#logout-btn)');
const submenuItems = document.querySelectorAll('.submenu-item');

window.addEventListener('load', function() {
    const sesionGuardada = localStorage.getItem('sesion_activa_teschi');
    if (sesionGuardada === 'true') {
        if (loginPageContainer) loginPageContainer.classList.add('hidden');
        if (dashboardContainer) dashboardContainer.classList.remove('hidden');
        if (reportesSubmenu) reportesSubmenu.classList.remove('hidden');
        
        resetearEstilosMenu();
        const btnRepMain = document.getElementById('btn-reportes-main');
        if (btnRepMain) btnRepMain.classList.add('active');
        if (submenuItems.length > 0) submenuItems[0].classList.add('active');
        
        activarContenidoCentral('tab-parciales');
        cargarCalificaciones();
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const matriculaIngresada = document.getElementById('matricula').value.trim();
        const passwordIngresada = document.getElementById('password').value;

        if (matriculaIngresada === USUARIO_VALIDO.matricula && passwordIngresada === USUARIO_VALIDO.password) {
            localStorage.setItem('sesion_activa_teschi', 'true');
            loginPageContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            reportesSubmenu.classList.remove('hidden');
            
            resetearEstilosMenu();
            const btnRepMain = document.getElementById('btn-reportes-main');
            if (btnRepMain) btnRepMain.classList.add('active');
            if (submenuItems.length > 0) submenuItems[0].classList.add('active');

            activarContenidoCentral('tab-parciales');
            cargarCalificaciones();
        } else {
            loginError.textContent = "Matrícula o contraseña incorrectas. Inténtalo de nuevo.";
        }
    });
}

mainButtons.forEach(button => {
    button.addEventListener('click', function() {
        mainButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        if (this.id === 'btn-reportes-main') {
            reportesSubmenu.classList.toggle('hidden');
            if (!reportesSubmenu.classList.contains('hidden')) {
                submenuItems.forEach(item => item.classList.remove('active'));
                if (submenuItems.length > 0) {
                    submenuItems[0].classList.add('active');
                }
                activarContenidoCentral('tab-parciales');
            }
        } else {
            reportesSubmenu.classList.add('hidden');
            const targetTabId = this.getAttribute('data-tab');
            activarContenidoCentral(targetTabId);
        }
    });
});

submenuItems.forEach(item => {
    item.addEventListener('click', function() {
        submenuItems.forEach(si => si.classList.remove('active'));
        this.classList.add('active');
        const targetTabId = this.getAttribute('data-tab');
        activarContenidoCentral(targetTabId);
    });
});

function resetearEstilosMenu() {
    mainButtons.forEach(b => b.classList.remove('active'));
    submenuItems.forEach(s => s.classList.remove('active'));
}

function activarContenidoCentral(tabId) {
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.add('hidden'));
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.remove('hidden');
}

function cargarCalificaciones() {
    if (gradesTableBody) gradesTableBody.innerHTML = ""; 
    if (finalGradesTableBody) finalGradesTableBody.innerHTML = ""; 
    
    let sumatoriaPromedios = 0;

    MATERIAS_DATA.forEach(row => {
        const promedioMateria = parseFloat(((row.p1 + row.p2 + row.p3) / 3).toFixed(1));
        sumatoriaPromedios += promedioMateria;

        if (gradesTableBody) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td class="center-text">${row.num}</td>
                <td class="text-left font-small">${row.docente}</td>
                <td class="text-left font-small">${row.materia}</td>
                <td class="center-text">${row.p1}</td>
                <td class="center-text">${row.p2}</td>
                <td class="center-text">${row.p3}</td>
                <td class="center-text font-small">${row.grupo}</td>
            `;
            gradesTableBody.appendChild(fila);
        }

        if (finalGradesTableBody) {
            const filaFinal = document.createElement('tr');
            const estatusMateria = promedioMateria >= 70 ? "APROBADA" : "REPROBADA";
            const colorEstatus = promedioMateria >= 70 ? "#15803d" : "#b91c1c";
            
            filaFinal.innerHTML = `
                <td class="center-text">${row.num}</td>
                <td class="text-left font-small">${row.materia}</td>
                <td class="center-text" style="font-weight: bold;">${promedioMateria}</td>
                <td class="center-text font-small" style="font-weight: bold; color: ${colorEstatus};">${estatusMateria}</td>
            `;
            finalGradesTableBody.appendChild(filaFinal);
        }
    });

    const promedioFinalSemestre = (sumatoriaPromedios / MATERIAS_DATA.length).toFixed(1);

    const contenedorPromedio = document.getElementById('promedio-semestre-container');
    if (contenedorPromedio) {
        contenedorPromedio.innerHTML = `
            <div style="margin-top: 25px; background: #f0fdf4; border: 1px solid #68ab59; border-left: 5px solid #15803d; padding: 15px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #14532d; font-size: 14px; margin: 0; font-weight: bold;">Promedio Final del Semestre Actual</h4>
                    <p style="color: #64748b; font-size: 11px; margin: 2px 0 0 0;">Cálculo automático con base en las notas registradas en las actas parciales.</p>
                </div>
                <div style="font-size: 24px; font-weight: bold; color: #15803d; background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 6px;">
                    ${promedioFinalSemestre}
                </div>
            </div>
        `;
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('sesion_activa_teschi');
        if (dashboardContainer) dashboardContainer.classList.add('hidden');
        if (loginPageContainer) loginPageContainer.classList.remove('hidden');
        if (loginForm) loginForm.reset();
        if (loginError) loginError.textContent = "";
    });
}
