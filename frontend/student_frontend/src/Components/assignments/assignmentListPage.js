// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import AssignmentNavigationBar from './assignmentNavigationBar';
export function AssignmentListPage() {
	return (
		<div className="flex flex-col px-10 min-h-screen items-left w-full pb-20 ">
			<AssignmentNavigationBar value={1} />
		</div>
	);
}
