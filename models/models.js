var path = require ('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		= (url[6]||null);
var user		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol	= (url[1]||null);
var dialect		= (url[1]||null);
var port 		= (url[5]||null);
var host  		= (url[4]||null);
var storage 	= process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
console.log ("DIALECT="+dialect);
var sequelize = new Sequelize (DB_name, user, pwd,
								{ dialect: 	protocol, 
								  protocol: protocol,
								  port: 	port, 
								  host: 	host, 
								  storage:  storage,	// solo SQLite (.env)
								  omitNull: true		// solo Postgres
								}
							  );

//Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; //exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if (count === 0) { //la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta:  'Capital de Italia2',
						  respuesta: 'Roma',
						  tema: 	 'otro' 
						});
			Quiz.create({ pregunta:  'Capital de Italia1',
						  respuesta: 'Roma',
						  tema: 	 'otro'
						});
			Quiz.create({ pregunta:  'Capital de Portugal',
						  respuesta: 'Lisboa',
						  tema: 	 'otro'
						});
			Quiz.create({ pregunta:  'Quién dijo: "Sólo sé que no se nada"',
						  respuesta: 'Sócrates',
						  tema: 	 'humanidades'
						});
			Quiz.create({ pregunta:  'Número mínimo de bits para almacenar el número 7',
						  respuesta: '3',
						  tema: 	 'tecnologia'
						});
			Quiz.create({ pregunta:  'Primer apellido de la persona que más influyó en la corriente alterna',
						  respuesta: 'Tesla',
						  tema: 	 'tecnologia'
						});
			Quiz.create({ pregunta:  'Nombre artístico del rapero más conocido de Violadores del Verso',
						  respuesta: 'Kase O',
						  tema: 	 'ocio'
						});
			Quiz.create({ pregunta:  'Qué tiene más densidad: Agua o Aceite',
						  respuesta: 'Agua',
						  tema: 	 'ciencia'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});