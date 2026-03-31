

export default function PostCard({ category, title, date, author, image }) {
    return (
        <div className="w-full h-full rounded-2xl flex flex-col justify-center gap-4 p-6 shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-300 ">
            <div className="w-full h-full overflow-hidden">
                <img src="https://cdn.pixabay.com/photo/2020/05/25/17/21/link-5219567_1280.jpg"
                    className="rounded object-cover hover:scale-105 transition-transform duration-500"></img>
            </div>
            <div className="flex flex-col items-start">
                <p className="text-sm text-gray-500 justify-self-start">{date}</p>
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div className="flex flex-row justify-between items-center">
                <p className="text-xs text-gray-600">Por {author}</p>
                <span className="text-sm text-gray-800">{category}</span>
            </div>
        </div>
    )
}