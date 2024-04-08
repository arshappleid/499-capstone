// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

export default function CoursePageCard(props) {
	return (
		<div
			className="w-[300px] h-full rounded-md  p-12 hover:border-transparent flex justify-center items-center relative my-10 shadow-lg shadow-slate-300 hover:shadow-2xl hover:shadow-slate-400 hover:scale-105 transform transition-all duration-300 ease-in-out"
			style={{
				backgroundColor: props.color,
				transition: 'background-color 0.3s ease',
				cursor: 'pointer',
			}}>
			<p className="text-2xl text-center">{props.type}</p>
		</div>
	);
}
