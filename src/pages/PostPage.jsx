import Navbar from "../shared/components/Navbar";

export default function PostPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="grid md:grid-cols-[0.7fr_2fr_1fr] gap-6 mt-8">
          {/*Autor*/}
          <div className="flex flex-col justify-end p-4 h-80">
            <div className="flex justify-center items-end w-full h-40">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg"
                className="w-25 h-25 object-cover rounded-full"
              ></img>
            </div>
            <h2 className="font-semibold text-md mt-2">Autor</h2>
            <p className="text-sm text-gray-800 font-stretch-125%">
              Esto es una descripción de prueba
            </p>
          </div>
          {/*Contenido*/}
          <div className="flex flex-col gap-2">
            <div className="w-full h-80 mx-auto p-2">
              <img
                src="https://cdn.pixabay.com/photo/2020/05/25/17/21/link-5219567_1280.jpg"
                className="w-full h-full mx-auto object-cover rounded-md"
              ></img>
            </div>
            <div className="flex flex-col items-start justify-center p-2">
              <p className="text-sm text-gray-500">1 de enero de 2025</p>
              <h2 className="text-2xl mt-1 ">Titulo del Post</h2>
              <span className="text-sm text-gray-800 mt-2 ">Categoria</span>
            </div>
          </div>
          {/*Anuncios */}
          <div className="p-4 text-sm text-gray-500">
            <h3>Anuncios</h3>
            <p>Contenido de anuncios</p>
          </div>
        </section>
      </main>
    </>
  );
}
