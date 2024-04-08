const { Instructor } = require('../database/index');

async function updateInstructorService(instructor_id, instructor_access) {
	try {
		const record = await Instructor.findOne({
			where: { INSTRUCTOR_ID: instructor_id },
		});
		if (record == null) {
			return {
				status: 'error',
				message: 'Instructor id not found',
			};
		}

		record.set({
			INSTRUCTOR_ACCESS: instructor_access,
		});
		await record.save();
		return {
			status: 'success',
			message: 'Instructor access updated successfully',
			current_state: {
				instructor_id: record.INSTRUCTOR_ID,
				instructor_access: record.INSTRUCTOR_ACCESS,
			},
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results : ' + e,
		};
	}
}

module.exports = updateInstructorService;
