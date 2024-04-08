'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const { Model, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], {
		...config,
		logging:
			process.env.NODE_ENV !== 'production' ||
			process.env.NODE_ENV !== 'test',
	});
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		{
			...config,
			logging:
				process.env.NODE_ENV !== 'production' ||
				process.env.NODE_ENV !== 'test',
		}
	);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Defining all the models here
const Student = sequelize.define(
	'STUDENT',
	{
		STUDENT_ID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		FIRST_NAME: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		MIDDLE_NAME: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		LAST_NAME: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		EMAIL: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		MD5_HASHED_PASSWORD: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		tableName: 'STUDENT',
		timestamps: false,
	}
);

const Instructor = sequelize.define(
	'INSTRUCTOR',
	{
		INSTRUCTOR_ID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		FIRST_NAME: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		MIDDLE_NAME: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		LAST_NAME: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		EMAIL: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		INSTRUCTOR_ACCESS: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		MD5_HASHED_PASSWORD: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		tableName: 'INSTRUCTOR',
		timestamps: false,
	}
);
const SuperAdmin = sequelize.define(
	'SUPER_ADMIN',
	{
		SUPER_ADMIN_ID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		EMAIL: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		MD5_HASHED_PASSWORD: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		tableName: 'SUPER_ADMIN',
		timestamps: false,
	}
);

const Course = sequelize.define(
	'COURSE',
	{
		COURSE_ID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		INSTRUCTOR_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		COURSE_NAME: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		COURSE_CODE: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		COURSE_SEMESTER: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		COURSE_YEAR: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		COURSE_TERM: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		COURSE_VISIBILITY: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		EXTERNAL_COURSE_LINK: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
	},
	{
		tableName: 'COURSE',
		timestamps: false,
	}
);

Course.belongsTo(Instructor, { foreignKey: 'INSTRUCTOR_ID' });

const InstructorCourse = sequelize.define(
	'INSTRUCTOR_COURSE',
	{
		INSTRUCTOR_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Instructor,
				key: 'INSTRUCTOR_ID',
			},
		},
		COURSE_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Course,
				key: 'COURSE_ID',
			},
		},
	},
	{
		tableName: 'INSTRUCTOR_COURSE',
		timestamps: false,
	}
);

Instructor.belongsToMany(Course, {
	through: InstructorCourse,
	foreignKey: 'INSTRUCTOR_ID',
});
Course.belongsToMany(Instructor, {
	through: InstructorCourse,
	foreignKey: 'COURSE_ID',
});

const StudentCourse = sequelize.define(
	'STUDENT_COURSE',
	{
		STUDENT_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Student,
				key: 'STUDENT_ID',
			},
		},
		COURSE_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Course,
				key: 'COURSE_ID',
			},
		},
	},
	{
		tableName: 'STUDENT_COURSE',
		timestamps: false,
	}
);

Student.belongsToMany(Course, {
	through: StudentCourse,
	foreignKey: 'STUDENT_ID',
});
Course.belongsToMany(Student, {
	through: StudentCourse,
	foreignKey: 'COURSE_ID',
});

Student.hasMany(StudentCourse, { foreignKey: 'STUDENT_ID' });
StudentCourse.belongsTo(Student, { foreignKey: 'STUDENT_ID' });

Course.hasMany(StudentCourse, { foreignKey: 'COURSE_ID' });
StudentCourse.belongsTo(Course, { foreignKey: 'COURSE_ID' });

const CourseGroupEvaluation = sequelize.define(
	'COURSE_GROUP_EVALUATION',
	{
		GROUP_ID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		GROUP_NAME: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		COURSE_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Course,
				key: 'COURSE_ID',
			},
		},
	},
	{
		tableName: 'COURSE_GROUP_EVALUATION',
		timestamps: false,
	}
);

CourseGroupEvaluation.belongsTo(Course, { foreignKey: 'COURSE_ID' });

const GroupMembersTable = sequelize.define(
	'GROUP_MEMBERS_TABLE',
	{
		STUDENT_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: Student,
				key: 'STUDENT_ID',
			},
		},
		GROUP_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: CourseGroupEvaluation,
				key: 'GROUP_ID',
			},
		},
	},
	{
		tableName: 'GROUP_MEMBERS_TABLE',
		timestamps: false,
	}
);

Student.hasMany(GroupMembersTable, { foreignKey: 'STUDENT_ID' });
GroupMembersTable.belongsTo(Student, { foreignKey: 'STUDENT_ID' });

CourseGroupEvaluation.hasMany(GroupMembersTable, { foreignKey: 'GROUP_ID' });
GroupMembersTable.belongsTo(CourseGroupEvaluation, { foreignKey: 'GROUP_ID' });

Student.belongsToMany(CourseGroupEvaluation, {
	through: GroupMembersTable,
	foreignKey: 'STUDENT_ID',
});
CourseGroupEvaluation.belongsToMany(Student, {
	through: GroupMembersTable,
	foreignKey: 'GROUP_ID',
});

const EvaluationForm = sequelize.define(
	'EVALUATION_FORM',
	{
		FORM_ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		FORM_NAME: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		COURSE_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Course,
				key: 'COURSE_ID',
			},
		},
		DEADLINE: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		SHARE_FEEDBACK: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		VISIBILITY: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{
		tableName: 'EVALUATION_FORM',
		timestamps: false,
	}
);

EvaluationForm.belongsTo(Course, { foreignKey: 'COURSE_ID' });

const EvaluationQuestion = sequelize.define(
	'EVALUATION_QUESTION',
	{
		QUESTION_ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		FORM_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: EvaluationForm,
				key: 'FORM_ID',
			},
		},
		QUESTION_TEXT: {
			type: DataTypes.STRING(1000),
			allowNull: true,
		},
		QUESTION_TYPE: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
	},
	{
		tableName: 'EVALUATION_QUESTION',
		timestamps: false,
	}
);

const EvaluationSection = sequelize.define(
	'EVALUATION_SECTION',
	{
		FORM_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
		},
		QUESTION_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
		},
		SECTION_NAME: {
			type: DataTypes.STRING(255),
		},
		SECTION_WEIGHT: {
			type: DataTypes.FLOAT(4),
			defaultValue: 1.0,
			allowNull: false,
		},
	},
	{
		tableName: 'EVALUATION_SECTION',
		timestamps: false,
	}
);

EvaluationSection.belongsTo(EvaluationForm, { foreignKey: 'FORM_ID' });
EvaluationForm.hasMany(EvaluationSection, { foreignKey: 'FORM_ID' });

EvaluationSection.belongsTo(EvaluationQuestion, { foreignKey: 'QUESTION_ID' });
EvaluationQuestion.hasMany(EvaluationSection, { foreignKey: 'QUESTION_ID' });

const EvaluationQuestionOption = sequelize.define(
	'EVALUATION_QUESTION_OPTION',
	{
		OPTION_ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		QUESTION_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: EvaluationQuestion,
				key: 'QUESTION_ID',
			},
		},
		OPTION_TEXT: {
			type: DataTypes.STRING(5000),
			allowNull: true,
		},
		OPTION_POINT: {
			type: DataTypes.FLOAT(4),
			defaultValue: 0.0,
			allowNull: false,
		},
	},
	{
		tableName: 'EVALUATION_QUESTION_OPTION',
		timestamps: false,
	}
);

EvaluationQuestion.hasMany(EvaluationQuestionOption, {
	foreignKey: 'QUESTION_ID',
});
EvaluationQuestionOption.belongsTo(EvaluationQuestion, {
	foreignKey: 'QUESTION_ID',
});

const EvaluationAnswer = sequelize.define(
	'EVALUATION_ANSWER',
	{
		EVALUATION_ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		FORM_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: EvaluationForm,
				key: 'FORM_ID',
			},
		},
		EVALUATOR_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Student,
				key: 'STUDENT_ID',
			},
		},
		EVALUATEE_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Student,
				key: 'STUDENT_ID',
			},
		},
		QUESTION_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: EvaluationQuestion,
				key: 'QUESTION_ID',
			},
		},
		ANSWER: {
			type: DataTypes.STRING(5000),
			allowNull: true,
		},
	},
	{
		tableName: 'EVALUATION_ANSWER',
		timestamps: false,
	}
);

EvaluationAnswer.belongsTo(EvaluationForm, { foreignKey: 'FORM_ID' });
EvaluationAnswer.belongsTo(Student, {
	foreignKey: 'EVALUATOR_ID',
	as: 'Evaluator',
});
EvaluationAnswer.belongsTo(Student, {
	foreignKey: 'EVALUATEE_ID',
	as: 'Evaluatee',
});
EvaluationAnswer.belongsTo(EvaluationQuestion, { foreignKey: 'QUESTION_ID' });

const StudentAuthToken = sequelize.define(
	'STUDENT_AUTH_TOKEN',
	{
		STUDENT_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Student,
				key: 'STUDENT_ID',
			},
		},
		AUTH_TOKEN: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		EXPIRY: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'STUDENT_AUTH_TOKEN',
		timestamps: false,
	}
);

StudentAuthToken.belongsTo(Student, { foreignKey: 'STUDENT_ID' });

const InstructorAuthToken = sequelize.define(
	'INSTRUCTOR_AUTH_TOKEN',
	{
		INSTRUCTOR_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Instructor,
				key: 'INSTRUCTOR_ID',
			},
		},
		AUTH_TOKEN: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		EXPIRY: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'INSTRUCTOR_AUTH_TOKEN',
		timestamps: false,
	}
);

InstructorAuthToken.belongsTo(Instructor, { foreignKey: 'INSTRUCTOR_ID' });

const CourseAssignment = sequelize.define(
	'COURSE_ASSIGNMENT',
	{
		ASSIGNMENT_ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		COURSE_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Course,
				key: 'COURSE_ID',
			},
		},
		ASSIGNMENT_NAME: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		DEADLINE: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		FORM_ID: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: EvaluationForm,
				key: 'FORM_ID',
			},
		},
	},
	{
		tableName: 'COURSE_ASSIGNMENT',
		timestamps: false,
	}
);

CourseAssignment.belongsTo(Course, { foreignKey: 'COURSE_ID' });
CourseAssignment.belongsTo(EvaluationForm, { foreignKey: 'FORM_ID' });

const AssignmentSubmission = sequelize.define(
	'ASSIGNMENT_SUBMISSION',
	{
		SUBMISSION_ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		ASSIGNMENT_ID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: CourseAssignment,
				key: 'ASSIGNMENT_ID',
			},
		},
		STUDENT_ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Student,
				key: 'STUDENT_ID',
			},
		},
		SUBMISSION_LINK: {
			type: DataTypes.STRING(1000),
			allowNull: false,
		},
	},
	{
		tableName: 'ASSIGNMENT_SUBMISSION',
		timestamps: false,
	}
);

AssignmentSubmission.belongsTo(CourseAssignment, {
	foreignKey: 'ASSIGNMENT_ID',
});
AssignmentSubmission.belongsTo(Student, { foreignKey: 'STUDENT_ID' });

// Syncing the changes
(async () => {
	await sequelize.sync({
		logging:
			process.env.NODE_ENV !== 'production' ||
			process.env.NODE_ENV !== 'test',
	});
})();

module.exports = {
	sequelize,
	Student,
	Instructor,
	SuperAdmin,
	Course,
	InstructorCourse,
	StudentCourse,
	CourseGroupEvaluation,
	GroupMembersTable,
	EvaluationForm,
	EvaluationQuestion,
	EvaluationSection,
	EvaluationQuestionOption,
	EvaluationAnswer,
	StudentAuthToken,
	InstructorAuthToken,
	CourseAssignment,
	AssignmentSubmission,
};
