function PanelCard({ children }) {
  return (
    <section className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col gap-2 justify-center items-center">
      {children}
    </section>
  );
}

export { PanelCard };
