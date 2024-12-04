import { useState, useEffect } from "react";
import axios from "axios";

export default function Api() {
  const [datas, setDatas] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setDatas(response.data);
        setFilteredData(response.data); 
      } catch (error) {
        console.error("Une erreur est survenue :", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtrage dynamique
    const filtered = datas.filter((country) =>
      country.name.common.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const openModal = (country) => {
    setSelectedCountry(country);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCountry(null);
    setShowModal(false);
  };

  return (
    <>
      {/* Barre de recherche */}
      <div className="w-full flex justify-center p-4 bg-gray-800">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          className="rounded border-2 border-gray-500 p-2 w-[50%]"
          placeholder="Rechercher un pays..."
        />
      </div>

      {/* Liste des pays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredData.length > 0 ? (
          filteredData.map((data) => (
            <div
              key={data.cca2}
              className="p-4 border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.name.common}
              </h2>
              <button
                onClick={() => openModal(data)}
                className="mt-2 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Voir détails
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-white col-span-full">
            Aucun pays ne correspond à votre recherche.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCountry?.name.common}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Fermer le modal</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Nom officiel :</strong> {selectedCountry?.name.official}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Population :</strong>{" "}
                  {selectedCountry?.population.toLocaleString()} habitants
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Région :</strong> {selectedCountry?.region}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Sous-région :</strong> {selectedCountry?.subregion}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Capitale :</strong>{" "}
                  {selectedCountry?.capital?.[0] || "Non spécifiée"}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Langues :</strong>{" "}
                  {selectedCountry?.languages
                    ? Object.values(selectedCountry.languages).join(", ")
                    : "Non spécifiées"}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Monnaies :</strong>{" "}
                  {selectedCountry?.currencies
                    ? Object.values(selectedCountry.currencies)
                        .map((currency) => currency.name)
                        .join(", ")
                    : "Non spécifiées"}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Fuseau horaire :</strong>{" "}
                  {selectedCountry?.timezones?.join(", ")}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong>Domaine :</strong> {selectedCountry?.tld?.join(", ")}
                </p>
                <img
                  src={selectedCountry?.flags?.svg}
                  alt={`Drapeau de ${selectedCountry?.name.common}`}
                  className="w-32 h-auto mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
