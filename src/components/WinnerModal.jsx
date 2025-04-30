const WinnerModal = ({ pokemon, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center max-w-sm w-full">
          {pokemon ? (
            <>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Zwycięzca!</h2>
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-32 h-32 mx-auto"
              />
              <p className="capitalize text-xl font-semibold mt-2">{pokemon.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                Waga: {pokemon.weight} | EXP: {pokemon.base_experience}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-yellow-500 mb-4">Remis!</h2>
              <p className="text-gray-700 text-md">Oba Pokemony miały taką samą siłę.</p>
            </>
          )}
          <button
            onClick={onClose}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-md transition"
          >
            Zamknij
          </button>
        </div>
      </div>
    );
  };
  
  export default WinnerModal;
  