export const About = () => {
  return (
    <div className="flex flex-col h-full p-6 m-4 bg-white rounded-lg shadow-lg bg-opacity-60 w-96">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-indigo-600">About SketchNSnort</h2>
      </div>

      <div className="flex-grow text-gray-700">
        <p className="mb-3">
          SketchNSnort is a fun drawing and guessing game where players take turns creating art and guessing what others have drawn.
        </p>

        <p className="mb-3">
          With easy-to-use drawing tools and a friendly interface, anyone can join the fun regardless of artistic ability!
        </p>

        <p className="mb-3">
          Created with passion for bringing people together through creative gameplay.
        </p>
      </div>

    </div>
  );
};


