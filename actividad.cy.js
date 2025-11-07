let emailRegistrado;
let dniRegistrado;

const nombresAleatorios = () => {
  const nombres = [
    "Lucía", "Mateo", "Sofía", "Juan", "Valentina", 
    "Tomás", "Camila", "Benjamín", "Martina", "Nicolás",
    "Julieta", "Santiago", "Isabella", "Thiago", "Mía",
    "Joaquín", "Emilia", "Agustín", "Lara", "Lucas"
  ];

  const randomIndex = Math.floor(Math.random() * nombres.length);
  return nombres[randomIndex];
}

const apellidosAleatorios = () => {
  const apellidos = [
    "Gómez", "Pérez", "Rodríguez", "Fernández", "López",
    "Martínez", "González", "Romero", "Sánchez", "Torres",
    "Díaz", "Ruiz", "Álvarez", "Moreno", "Muñoz",
    "Castro", "Silva", "Rojas", "Navarro", "Molina"
  ];

  const randomIndex = Math.floor(Math.random() * apellidos.length);
  return apellidos[randomIndex];
};

const celularesAleatorios = () => {
  const codigoPais = "+54 9";
  const prefijos = ["11", "221", "261", "341", "351", "381", "387", "379"];
  const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
  const numero = Math.floor(1000000 + Math.random() * 9000000);
  return `${codigoPais} ${prefijo} ${numero}`;
};

const dniAleatorios = () => {
  const dni = Math.floor(10000000 + Math.random() * 90000000);
  return dni.toString();
};


const fechaNacimientoAleatoria = () => {
  const anio = Math.floor(Math.random() * (2005 - 1980 + 1)) + 1980;
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1; // 28 para evitar problemas con febrero

  return {
    dia: dia.toString().padStart(2, '0'),
    mes: mes.toString().padStart(2, '0'),
    anio: anio.toString(),
  };
};

const emailAleatorio = (domain = 'gmail.com') => 
  `u${Date.now().toString().slice(-6)}${Math.floor(Math.random()*9000)}@${domain}`;

const contrasenaAleatoria = () => {
  const m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 
        n = "abcdefghijklmnopqrstuvwxyz", 
        d = "0123456789", 
        s = "!@#$%^&*";
  let p = m[~~(Math.random()*m.length)] + 
          n[~~(Math.random()*n.length)] + 
          d[~~(Math.random()*d.length)] + 
          s[~~(Math.random()*s.length)];
  const t = m+n+d+s;
  while (p.length < 8) p += t[~~(Math.random()*t.length)];
  return [...p].sort(()=>Math.random()-0.5).join('');
};

describe('Formulario de Registro', () => {
  beforeEach(() => {
    cy.visit('https://ticketazo.com.ar/auth/registerUser')
  })

  it('Ejercicio 1: Custom commands', () => {
    const nombre = nombresAleatorios()
    const apellido = apellidosAleatorios()
    const celular = celularesAleatorios()
    const dni = dniAleatorios()
    const { dia, mes, anio } = fechaNacimientoAleatoria();
    const email = emailAleatorio()
    const contrasenia = contrasenaAleatoria()

    emailRegistrado = email;
    dniRegistrado = dni;

    cy.completarDatosPersonales(nombre, apellido, celular, dni)
    cy.seleccionarProvinciaYLocalidad('Córdoba', 'Córdoba')
    cy.ingresarFechaNacimiento(dia, mes, anio)
    cy.ingresarEmails(email)
    cy.ingresarPasswords(contrasenia)

    cy.get('[data-cy="btn-registrarse"]').click()
     cy.wait(2000)

    //Ejercicio 4: Validar redirección exitosa
    cy.url().should('eq', 'https://ticketazo.com.ar/auth/login')

  })

    it('Ejercicio 2: Test para email ya registrado', () => {

      const nombre = nombresAleatorios()
      const apellido = apellidosAleatorios()
      const celular = celularesAleatorios()
      const dni = dniAleatorios()
      const { dia, mes, anio } = fechaNacimientoAleatoria();
      const email = emailAleatorio()
      const contrasenia = contrasenaAleatoria()

      cy.completarDatosPersonales(nombre, apellido, celular, dni)
      cy.seleccionarProvinciaYLocalidad('Córdoba', 'Córdoba')
      cy.ingresarFechaNacimiento(dia, mes, anio)
      cy.ingresarEmails(emailRegistrado)
      cy.ingresarPasswords(contrasenia)

      cy.get('[data-cy="btn-registrarse"]').click()
      cy.wait(1000)

  })

    it('Ejercicio 3: Test para DNI ya registrado', () => {

      const nombre = nombresAleatorios()
      const apellido = apellidosAleatorios()
      const celular = celularesAleatorios()
      const { dia, mes, anio } = fechaNacimientoAleatoria();
      const email = emailAleatorio()
      const contrasenia = contrasenaAleatoria()

      cy.completarDatosPersonales(nombre, apellido, celular, dniRegistrado)
      cy.seleccionarProvinciaYLocalidad('Córdoba', 'Córdoba')
      cy.ingresarFechaNacimiento(dia, mes, anio)
      cy.ingresarEmails(email)
      cy.ingresarPasswords(contrasenia)

      cy.get('[data-cy="btn-registrarse"]').click()
      cy.wait(1000)

  })

    it('Ejercicio 5: Validación de requisitos de contraseña', () => {
    const nombre = nombresAleatorios()
    const apellido = apellidosAleatorios()
    const celular = celularesAleatorios()
    const dni = dniAleatorios()
    const { dia, mes, anio } = fechaNacimientoAleatoria();
    const email = emailAleatorio()
    const contraseniaInvalida = '1234'

    cy.completarDatosPersonales(nombre, apellido, celular, dni)
    cy.seleccionarProvinciaYLocalidad('Córdoba', 'Córdoba')
    cy.ingresarFechaNacimiento(dia, mes, anio)
    cy.ingresarEmails(email)
    cy.ingresarPasswords(contraseniaInvalida)

    cy.get('[data-cy="btn-registrarse"]').click()
    cy.wait(1000)
    cy.contains('contraseña').should('be.visible')
  })


})

