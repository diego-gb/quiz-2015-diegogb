var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statsData = {};

exports.obtainData = function(req, res, next) {
//Se ha usado el método all de Promises (implementado ya en sequelize), ya que
//de esta forma se ejecutan las consultas asíncronamente en paralelo y se
//continúa cuando han acabado todas.
    Sequelize.Promise.all([
        models.Quiz.count(),
        models.Comment.count(),
//Se ha añadido nuevos métodos al modelo Comment en models/comment.js
//Para ello se han seguido las instucciones de la documentación de sequelize:
//http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
        models.Comment.countCommentedQuizes(),
        models.Comment.countUnpublished()
    ]).then( function( values ){
        statsData.num_quizzes=values[0];
        statsData.num_comments=values[1];
        statsData.num_quizzes_with_comments=values[2];
        statsData.num_quizzes_without_comments = statsData.num_quizzes-statsData.num_quizzes_with_comments;
        statsData.commentsUnpublished=values[3];
    }).catch( function (err) {
        next(err);
    }).finally( function() {
        next();
    });
};

// GET /quizes/statistics
exports.show = function(req, res) {
    res.render('quizes/statistic.ejs', {
        statistics: statsData,
        errors: []
    });
};