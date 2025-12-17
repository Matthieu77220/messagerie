import { useNavigate } from "react-router";

function Accueil() {

    const navigate = useNavigate();

    return ( 
        <>
        <div className="flex justify-center text-center">
            <button 
            type="button"
            onClick={() => navigate("/messagerie")}
            className="bg-teal-400 p-2 text-white text-3xl font-semibold transition duration-200 hover:opacity-60 hover:p-4 hover:transition hover:duration-200"
            >
                Messagerie
            </button>
        </div>
        </>
     );
}

export default Accueil;