import CategoryBox from "../components/CategoryBox";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl xl:max-w-[90%] mx-auto px-4">
        <section className="flex flex-col items-center justify-center gap-4 p-6 border-gray-300 border-b">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2 p-4 ">
            {/* {posts.map((p) => (
              <Link key={p.id} to="/Page/demo" className="block">
                <PostCard {...p} />
              </Link>
            ))} */}
          </div>
        </section>

        <section className=" flex flex-col p-6">
          <h2 className="text-2xl font-semibold mb-4 self-start">Categorias</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 mt-2">
            {/* {categoriesDemo.map((c) => (
              <CategoryBox key={c.i} {...c} />
            ))} */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
