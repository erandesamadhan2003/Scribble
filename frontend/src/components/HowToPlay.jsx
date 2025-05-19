export const HowToPlay = () => {
  const instruction = [
    `Choose a word from the provided options or get a random one`,
    `Draw your word within the time limit using the drawing tools`,
  `Other players try to guess what you've drawn in the chat`,
    `Earn points for correct guesses and accurate drawings`
  ]
  
  return (
    <div className="flex flex-col h-full p-6 m-4 bg-white rounded-lg shadow-lg bg-opacity-60 w-96">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-2xl font-bold text-emerald-600">How To Play</h2>
      </div>

      <div className="flex-grow text-gray-700">
        {instruction.map((elem, index) => (
          <div className="flex items-start mb-3" key={index}>
            <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 rounded-full bg-emerald-100 text-emerald-800">{index + 1}</div>
            <p>{elem}</p>
          </div>
        ))}
      </div>
      <div className="pt-4 mt-auto border-t border-gray-200">
        <p className="text-sm italic text-center text-emerald-600">
          No artistic skills required—just creativity and fun!
        </p>
      </div>
    </div>
  );
};